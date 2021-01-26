import React from 'react';
import {ContextMenuTrigger} from 'react-contextmenu';
import {CONTEXT_MENU_ID} from '../../ContextMenu';
import ListViewBase from '../ListViewBase';
import InfiniteScroll from 'react-infinite-scroll-component';
import Files from './files';

class GridItemListView extends ListViewBase {

    state = {
        prev: 0,
        next: 10,
        hasMore: false,
        current: false,
    };

    render() {
        const {items} = this.props;
        if (items.dirs.length === 0 && items.files.length === 0) {
            return (
                <div>
                    {
                        this.props.reloading ?
                            <svg viewBox="0 0 32 32" width="48" height="48" stroke-width="4" fill="none" stroke="currentcolor" role="img" class="css-qhckx3">
                                <title>Loading...</title>
                                <circle cx="16" cy="16" r="12" opacity="0.125"></circle>
                                <circle cx="16" cy="16" r="12" stroke-dasharray="75.39822368615503" stroke-dashoffset="56.548667764616276" class="css-wpcq6n"></circle>
                            </svg> :
                            <div className="fm-alert empty">
                                <p>This folder is empty. Add some files or create folder.</p>
                            </div>
                    }
                </div>
            );
        }

        return (<div>
            <h4 id="folders-heading" className="heading-title">Folders</h4>

            {items.dirs.length
                ? (<>
                    <div className="folder-items">
                        {items.dirs.map(item => (
                            <div key={item.id} className={this.className(item)}>
                                {this.getFolderBlock(item)}
                            </div>
                        ))}
                    </div>
                </>)
                : <div className="fm-alert">
                    <p>No sub directory found.</p>
                </div>}

            <h4 id="files-heading" className="heading-title">Files</h4>
            {items.files.length
                ? (<>
                    {
                        <Files getFileBlock={(item) => this.getFileBlock(item)} files={items.files}
                               className={(item) => this.className(item)} />
                    }
                </>)
                : <div className="fm-alert">
                    <p>No items match your search</p>
                </div>}
        </div>);
    }

    getFolderBlock(item) {
        return (
            <div className="fm-folder-block-root"
                 id={item.id}
                 onDoubleClick={this.handleDoubleClick(item)}
                 onClick={this.handleClick(item)}
            >
                <ContextMenuTrigger
                    key={item.id}
                    id={CONTEXT_MENU_ID}
                    holdToDisplay={1000}
                    name={item.name}
                    collect={this.collect(item)}
                    attributes={this.getAttributes(item)}
                    style={{height: '100%'}}
                >
                    <div className="folderThumb">
                        <img src={this.thumb(item)} alt="" />
                    </div>
                    <p>{item.name} {item.components}</p>
                </ContextMenuTrigger>
            </div>
        );
    }

    getFileBlock = item => {
        return (
            <div className="fm-file-block-root"
                 id={item.id}
                 onDoubleClick={this.handleDoubleClick(item)}
                 onClick={this.handleClick(item)}
            >
                <ContextMenuTrigger
                    key={item.id}
                    id={CONTEXT_MENU_ID}
                    holdToDisplay={1000}
                    name={item.name}
                    collect={this.collect(item)}
                    attributes={this.getAttributes(item)}
                    style={{height: '100%'}}
                >
                    <div className="fm-file-thumb-wrapper">
                        <div className="fm-file-thumb">
                            <img src={this.thumb(item)} alt="" />
                        </div>
                    </div>
                    <p className="fm-file-info">
                        <span className="fm-file-name">{item.name}</span>
                        {item.components}
                    </p>
                </ContextMenuTrigger>
            </div>
        );
    };

}

export default GridItemListView;
