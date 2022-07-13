import "./style/bookmarks.css";
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);


const Pagination = ({ page, pages, changePage }) => {
  let middlePagination;

  if (pages <= 5) {
    middlePagination = [...Array(pages)].map((_, idx) => (
      <button
        key={idx + 1}
        onClick={() => changePage(idx + 1)
        }
        disabled={page === idx + 1  }
      >
        <p> {idx + 1}</p>
      </button>
    ));
  } else {
    const startValue = Math.floor((page - 1) / 5) * 5;

    middlePagination = (
      <>
        {[...Array(5)].map((_, idx) => (
          <button
            key={startValue + idx + 1}
            disabled={page === startValue + idx + 1 }
            onClick={() => changePage(startValue + idx + 1)}
          >
            <p>{startValue + idx + 1}</p>
          </button>
        ))}

        <button ><p>...</p></button>
        <button
          onClick={() => changePage(pages)}
        >
          <p>{pages}</p>
        </button>
      </>
    );

    if (page > 5) {
      if (pages - page >= 5) {
        middlePagination = (
          <>
            <button onClick={() => changePage(1)}>
              <p>1</p>
            </button>
            <button><p>...</p></button>
            <button onClick={() => changePage(startValue)}>
              <p>{startValue}</p>
            </button>
            {[...Array(5)].map((_, idx) => (
              <button
                key={startValue + idx + 1}
                disabled={page === startValue + idx + 1 }
                onClick={() => changePage(startValue + idx + 1)}
              >
                <p>{startValue + idx + 1}</p>
              </button>
            ))}

            <button><p>...</p></button>
            <button onClick={() => changePage(pages)}>
              <p>{pages}</p>
            </button>
          </>
        );
      } else {
        let amountLeft = pages - page + 5;
        middlePagination = (
          <>
            <button onClick={() => changePage(1)}>
              <p>1</p>
            </button>
            <button><p>...</p></button>
            <button onClick={() => changePage(startValue)}>
              <p>{startValue}</p>
            </button>
            {[...Array(amountLeft)].map((_, idx) => (
              <button
                key={startValue + idx + 1}
                disabled={page === startValue + idx + 1 }
                style={
                  pages < startValue + idx + 1 ? { display: "none" } : null
                }
                onClick={() => changePage(startValue + idx + 1)}
              >
                <p>{startValue + idx + 1}</p>
              </button>
            ))}
          </>
        );
      }
    }
  }

  return (
    pages > 1 && (
      <div className="pagination">
        <button
          className="pagination__prev"
          onClick={() => changePage((page) => page - 1)}
          disabled={page === 1 }
        >
          <p>&#171;</p>
        </button>
        {middlePagination}
        <button
          className="pagination__next"
          onClick={() => changePage((page) => page + 1)}
          disabled={page === pages }
        >
          <p>&#187;</p>
        </button>
      </div>
    )
  );
};

export default Pagination;