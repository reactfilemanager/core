import React from 'react';
import Controls from './Controls';
import DirectoryTree from './DirectoryTree';
import Entries from './Entries';
import {useStore} from '../../state/store';

export default () => {
  const [state, dispatch] = useStore();

  return (
      <div className="row file-manager">
        <div className="col-md-12">
          <div className="row">
            <div className="col-md-12">
              <Controls defaults/>
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
              <Controls/>
            </div>
          </div>
        </div>
        <div className="col-md-12">
          <div className="row">
            <div className="col-md-3">
              <DirectoryTree/>
            </div>
            <div className="col-md-9">
              <Entries/>
            </div>
          </div>
        </div>
      </div>
  );
}
