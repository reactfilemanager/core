/** @jsx jsx */
import { jsx, Flex, Box } from 'theme-ui'

import Breadcrumb from '../Breadcrumb';
import ItemList from '../ItemList';
import Toolbar from '../Toolbar';
import {getConfig, getDefaultConfig} from '../../config';
import DirectoryTree from '../DirectoryTree';

export default function() {
const [state, dispatch] = window.useStore();
const defaultConfig = getDefaultConfig();
const config = getConfig();

  return (
    <Flex>
      <Box
        sx={{ 
          background: 'gray',
          flex: '0 0 auto',
          width: '272px',
          maxWidth: '272px',
          borderRight: '1px solid #ccc',
          height: 'auto'
        }}
      >
        <DirectoryTree
          state={state.general}
          dispatch={dispatch}
        />
      </Box>
      <Box 
       sx={{ 
          flex: '1 1 auto',
        }}>
        <div>
          <Toolbar
            state={state.general}
            dispatch={dispatch}
            children={defaultConfig.toolbar}
          />

          {config.toolbar ?
            <Toolbar
                state={state.general}
                dispatch={dispatch}
                children={config.toolbar}
            />
          : null}

          <Breadcrumb
              path={state.general.path}
              dispatch={dispatch}
          />
        </div>
        <div>
          <ItemList
            state={state.general}
            dispatch={dispatch}
          />
        </div>
      </Box>
    </Flex>
      // <div className="row">
      
      
      //   <div className="col-md-12">
      //     <div className="row">
      //      
      //       <div className="col-md-10">
      //         <div className="row">
      //           <div className="col-md-12">
      //             <Breadcrumb
      //                 path={state.general.path}
      //                 dispatch={dispatch}
      //             />
      //           </div>
      //           
      //         </div>
      //       </div>
      //     </div>
      //   </div>
      // </div>
  );
}
