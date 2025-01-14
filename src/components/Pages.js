import { observer } from "mobx-react-lite";
import React, { useContext } from "react";
import { Context } from "..";
import { Pagination } from "react-bootstrap";

const Pages = observer(() =>{
    const {answer} = useContext(Context)
    const pageCount = Math.ceil(answer.totalCount / answer.limit)
    console.log(answer.totalCount, answer.limit, pageCount)
    const pages = []

    for (let i = 0; i < pageCount; i++) {
        pages.push(i + 1)
    }
    return(
        <Pagination className="mt-5">
            {pages.map(page =>
                <Pagination.Item
                    key={page}
                    active={answer.page === page}
                    onClick={() => answer.setPage(page)}
                >
                    {page}
                </Pagination.Item>
            )}
        </Pagination>

    );
});

export default Pages;