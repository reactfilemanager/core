/** @jsx jsx */
import {jsx, Flex, Link} from 'theme-ui';
import {bootPlugins, getTabs} from '../pluggable';
import {useStore} from '../state/store';
import {ToastContainer, Flip} from 'react-toastify';

export default () => {

  const [state, dispatch] = useStore();
  bootPlugins(state, dispatch);

  const tabs = getTabs();
  let navs = [];
  let contents = [];
  let activeFirst = false;
  for (const tab of tabs) {
    navs.push(
        <Link
          id={tab.key + '-tab'}
          key={tab.key}
          href={'#' + tab.key}
          role="tab"
          aria-controls={tab.key}
          aria-selected="true"
          sx={{
            px: 4,
            py: 2,
            bg: '#fafbfb',
            textDecoration: 'none',
            color: 'gray',
            fontSize: 12,
            textTransform: 'uppercase',
          }}
        >
          {tab.title}
        </Link>,
    );
    contents.push(
        <div
          key={tab.key}
          sx={{
            overflow: 'hidden'
          }}
        >
          <tab.component state={state} dispatch={dispatch}/>
        </div>,
    );
  }

  return (
      <div>
        {navs.length > 1
            ? <Flex sx={{ bg: '#f5f5f5', }}>
              {navs}
            </Flex>
            : null
        }
        <div>
          {contents}
        </div>

        <ToastContainer
            position="top-right"
            autoClose={2500}
            hideProgressBar
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnVisibilityChange
            draggable
            pauseOnHover
            transition={Flip}
        />
      </div>
  );
}
