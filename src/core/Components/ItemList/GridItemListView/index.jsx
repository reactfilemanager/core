import React from 'react';
import {ContextMenuTrigger} from 'react-contextmenu';
import {CONTEXT_MENU_ID} from '../../ContextMenu';
import ListViewBase from '../ListViewBase';

class GridItemListView extends ListViewBase {

  render() {
    const {items} = this.props;
    if (items.dirs.length === 0 && items.files.length === 0) {
      return (
        <div>
          {
            this.props.reloading ?
              <div>Spinner</div> :
              <h4>No entry in this directory</h4>}
        </div>
      );
    }

    return (<div>
      {items.dirs.length
        ? (<>
          <h4>Folders</h4>

          <div>
            {items.dirs.map(item => (
              <div key={item.id} className={this.className(item)}>
                {this.getFolderBlock(item)}
              </div>
            ))}
          </div>
        </>)
        : null}

      {items.files.length
        ? (<>      <h4>Files</h4>

          <div>
            {items.files.map(item => (
              <div key={item.id} className={this.className(item)}>
                {this.getFileBlock(item)}
              </div>
            ))}
          </div>
        </>)
        : null}
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
          <img src={this.thumb(item)} alt=""/>
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
              <img src={this.thumb(item)} alt=""/>
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
