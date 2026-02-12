import { protocol } from 'electron'
import * as fs from 'fs'
import * as path from 'path'
import { app } from 'electron'

export function initProtocol() {
  protocol.handle('app', async (request) => {
    try {
      const url = new URL(request.url)
      let filePath = decodeURIComponent(url.pathname)

      // Windows 路径处理
      if (process.platform === 'win32' && filePath.startsWith('/')) {
        filePath = filePath.substring(1)
      }

      // 安全检查
      const imagesDir = path.join(app.getPath('userData'), 'images').replace(/\\/g, '/')
      const normalizedFilePath = filePath.replace(/\\/g, '/')

      // 为了调试，先打印看看
      console.log('FilePath:', normalizedFilePath)
      console.log('ImagesDir:', imagesDir)
      console.log(
        'Starts with:',
        normalizedFilePath.toLowerCase().startsWith(imagesDir.toLowerCase())
      )

      if (!normalizedFilePath.toLowerCase().startsWith(imagesDir.toLowerCase())) {
        return new Response('Forbidden', { status: 403 })
      }

      const data = await fs.promises.readFile(filePath)
      const ext = path.extname(filePath).toLowerCase()

      const mimeTypes: Record<string, string> = {
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.png': 'image/png',
        '.gif': 'image/gif',
        '.webp': 'image/webp'
      }

      return new Response(data, {
        headers: { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' }
      })
    } catch (error) {
      console.error('Protocol error:', error)
      return new Response('Not Found', { status: 404 })
    }
  })
}
