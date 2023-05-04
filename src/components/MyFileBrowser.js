import {
  FileBrowser,
  setChonkyDefaults,
  ChonkyActions,
  FileNavbar,
  FileToolbar,
  FileList,
  FileContextMenu,
} from '@bhunter179/chonky'
import { ChonkyIconFA } from '@bhunter179/chonky-icon-fontawesome'
import { useEffect, useState, memo, useMemo, useContext, useRef } from 'react'
import { chonkyFileActions, handleAction } from '@/utils/chonkyactions'
import { chainLinks, getFiles } from '@/utils/common'
import { styled } from '@mui/material/styles';
import { useQueryClient } from '@tanstack/react-query'
import { useFetchItems } from '@/hooks/queryhooks'
import { isMobileDevice } from '@/utils/common'
import { useRouter } from 'next/router'
import PreviewModal from './PreviewModal'
import FileModal from './FileModal'
import Upload from './upload'

const disableDefaultFileActions = [ChonkyActions.SortFilesByDate.id,
ChonkyActions.SortFilesBySize.id]

const PREFIX = 'MyFileBrowser';

const classes = {
  root: `${PREFIX}-root`,
  progress: `${PREFIX}-progress`
};

const Root = styled('div')((
  {
    theme
  }
) => ({
  [`&.${classes.root}`]: {
    height: '85vh',
    width: '100%',
    margin: 'auto',
    top: '70px',
  },

  [`& .${classes.progress}`]: {
    margin: 'auto',
    color: theme.palette.text.primary,
    height: '30px !important',
    width: '30px !important',
  }

}));

setChonkyDefaults({ iconComponent: ChonkyIconFA })

const MyFileBrowser = () => {

  const [queryEnabled, setqueryEnabled] = useState(false);

  const isMobile = isMobileDevice()

  const router = useRouter()

  const { path } = router.query


  const queryClient = useQueryClient()

  const uploadRef = useRef()

  useEffect(() => {
    if (path[0] === 'my-drive')
      setqueryEnabled(true);

    else if (path[0] === 'search' && path.length > 1) {
      setqueryEnabled(true);
    }

    else {
      setqueryEnabled(false);
    }

  }, [path]);

  const queryParams = useMemo(() => {
    return {
      key: 'files', path, type: path[0], enabled: queryEnabled
    }
  }, [queryEnabled, path])

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
  } = useFetchItems(queryParams)

  const files = useMemo(
    () => data?.pages?.flatMap(page => page?.results ? getFiles(page.results) : []),
    [data]
  );

  const folderChain = useMemo(() => {
    if (path[0] == 'my-drive') {
      return Object.entries(chainLinks(path)).map(([key, value]) => (
        { id: key, name: key, path: value, isDir: true, chain: true }
      )
      )
    }

  }, [path]);


  const [modalState, setModalState] = useState({ open: false, operation: 'rename_file' });

  return (
    <Root className={classes.root}>
      <FileBrowser
        files={files}
        folderChain={folderChain}
        onFileAction={handleAction(router, setModalState, queryClient, uploadRef?.current?.showOpenFileDialog)}
        fileActions={chonkyFileActions}
        disableDefaultFileActions={disableDefaultFileActions}
        disableDragAndDropProvider={isMobile ? true : false}
        defaultFileViewActionId={ChonkyActions.EnableListView.id}
        useStoreProvider={false}
        useThemeProvider={false}
      >
        {path[0] == 'my-drive' && <FileNavbar />}

        <FileToolbar />

        <FileList
          hasNextPage={hasNextPage}
          isNextPageLoading={isFetchingNextPage}
          loadNextPage={fetchNextPage} />
        <FileContextMenu />
      </FileBrowser>
      {modalState.type === 'file' && modalState.open &&
        <FileModal modalState={modalState} setModalState={setModalState}
          queryParams={queryParams} path={path} />
      }

      {modalState.type === 'preview' && modalState.open &&
        <PreviewModal modalState={modalState} setModalState={setModalState}
          path={path} files={files} />
      }

      <Upload ref={uploadRef} />
    </Root>
  );
}

export default memo(MyFileBrowser)
