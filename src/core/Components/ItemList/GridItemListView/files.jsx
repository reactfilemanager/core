import React, {useState, useEffect} from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

const PAGINATION_LIMIT = 200;

function Files(props) {
    const data = props.files;

    const [offset, setOffset] = useState(PAGINATION_LIMIT);
    const [_target, setTarget] = useState(null);
    const target = _target || document.querySelector('.main-content');
    if (!_target) {
        setTarget(target);
    }

    const [hasMore, setHasMore] = useState(true);
    const [current, setCurrent] = useState(data.slice(0, offset));
    const getMoreData = () => {
        if (current.length >= data.length) {
            setHasMore(false);
            return;
        }
        setCurrent([...current, ...data.slice(offset, offset + PAGINATION_LIMIT)]);
        setOffset(offset + PAGINATION_LIMIT);
    };

    return (
        <InfiniteScroll
            scrollableTarget={target}
            dataLength={current.length}
            next={getMoreData}
            hasMore={hasMore}
            loader={<h4 className="fm-item" style={{color: 'orange'}}>Loading...</h4>}
            className="file-items"
        >
            {
                current && current.map(((item, index) => (
                    <div key={item.id} className={props.className(item)}>
                        {props.getFileBlock(item)}
                    </div>
                )))
            }
        </InfiniteScroll>
    );

}

export default Files;
