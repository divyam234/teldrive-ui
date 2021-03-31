import {
  defineFileAction,
  ChonkyActions,
  ChonkyIconName,
  FileHelper,
} from '@bhunter179/chonky'
import { navigateToExternalUrl } from './common'
import http from './http'
import { getExtension } from '@/utils/common';
import { getPreviewType, preview } from '@/utils/getPreviewType';
import { realPath } from "@/utils/common";

const DownloadFile = defineFileAction({
  id: 'download_file',
  requiresSelection: true,
  fileFilter: file => (file && 'isDir' in file ? false : true),
  button: {
    name: 'Download',
    contextMenu: true,
    icon: ChonkyIconName.download,
  }
})

export const RenameFile = defineFileAction({
  id: 'rename_file',
  requiresSelection: true,
  button: {
    name: 'Rename',
    contextMenu: true,
    icon: ChonkyIconName.rename,
  }
})

export const DeleteFile = defineFileAction({
  id: 'delete_file',
  requiresSelection: true,
  button: {
    name: 'Delete',
    contextMenu: true,
    icon: ChonkyIconName.trash
  }
})

export const AddFolder = defineFileAction({
  id: 'add_folder',
  button: {
    name: 'New Folder',
    toolbar: true,
    icon: ChonkyIconName.folderCreate,
  }
})

const OpenInVLCPlayer = defineFileAction({
  id: 'open_vlc_player',
  requiresSelection: true,
  fileFilter: file => (file && getPreviewType(getExtension(file.name)) == 'video'
    && !('isDir' in file) ? true : false),
  button: {
    name: 'Open In VLC',
    contextMenu: true,
    icon: ChonkyIconName.play,
  }
})

const CopyDownloadLink = defineFileAction({
  id: 'copy_link',
  requiresSelection: true,
  fileFilter: file => (file && 'isDir' in file ? false : true),
  button: {
    name: 'Copy Download Link',
    contextMenu: true,
    icon: ChonkyIconName.copy,
  }
})

export const handleAction = (router, setModalState, queryClient, showOpenFileDialog) => {

  return async data => {
    if (data.id == ChonkyActions.OpenFiles.id) {

      let { targetFile, files } = data.payload
      let fileToOpen = targetFile ?? files[0]
      if (fileToOpen && FileHelper.isDirectory(fileToOpen))
        router.push(fileToOpen.path)
      else {
        let previewType = getPreviewType(getExtension(fileToOpen.name))
        if (!FileHelper.isDirectory(fileToOpen) && previewType in preview) {
          setModalState({ type: 'preview', open: true })
        }
      }
    }

    else if (data.id == DownloadFile.id) {
      let { selectedFiles } = data.state
      for (let file of selectedFiles) {
        if (!FileHelper.isDirectory(file)) {
          let { name, id } = file
          let url = `/api/media/${id}/${encodeURIComponent(name)}?d=1`
          navigateToExternalUrl(url, false)
        }
      }
    }

    else if (data.id == RenameFile.id)
      setModalState({ type: 'file', open: true, file: data.state.selectedFiles[0], operation: RenameFile.id })

    else if (data.id == ChonkyActions.CreateFolder.id)
      setModalState({ type: 'file', open: true, file: { name: '' }, operation: ChonkyActions.CreateFolder.id })


    else if (data.id == CopyDownloadLink.id) {
      let selections = data.state.selectedFilesForAction
      let clipboardText = ''
      selections.forEach(element => {
        if (!FileHelper.isDirectory(element))
          clipboardText = `${clipboardText}/api/media/${element.id
            }/${encodeURIComponent(element.name)}?d=1\n`
      })
      navigator.clipboard.writeText(clipboardText)
    }

    else if (data.id == ChonkyActions.MoveFiles.id) {
      const { files, destination } = data.payload
      let res = await http.post('/api/files/movefiles', {
        files: files.map(file => file.id),
        destination: realPath(destination.path.split('/').slice(1))
      })
      if (res.data.status)
        queryClient.invalidateQueries('files')
    }

    else if (data.id == ChonkyActions.SortFilesByName.id)
      queryClient.invalidateQueries('files')
    //queryClient.removeQueries('files', { inactive: true })

    else if (data.id == ChonkyActions.UploadFiles.id)
      showOpenFileDialog()
  }
}

export const chonkyFileActions = [
  DownloadFile,
  RenameFile,
  DeleteFile,
  CopyDownloadLink,
  OpenInVLCPlayer,
  ChonkyActions.CreateFolder,
  ChonkyActions.UploadFiles
]
