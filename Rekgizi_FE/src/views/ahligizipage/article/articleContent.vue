<template>
  <AhliGiziLayout>
    <div class="w-full mx-4 h-auto bg-[#EAD3AF] my-4 rounded-lg overflow-hidden">
      <div class="bg-[#FAB12F] p-4 flex items-center justify-between gap-3 text-2xl font-[jua]">
        <span class="cursor-pointer"> {{ isEdit ? 'Edit Article' : 'Create Article' }} </span>
        <button
          @click="router.back()"
          class="text-sm bg-white text-[#FA812F] px-3 py-1 rounded-md hover:bg-gray-100 transition"
        >
          Back
        </button>
      </div>

      <div class="p-4">
        <form @submit.prevent="handleSubmit">
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Judul</label>
            <input
              v-model="form.title"
              type="text"
              required
              class="w-full border bg-white border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FA812F]"
              placeholder="Masukkan judul artikel"
            />
          </div>

          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1"> Thumbnail </label>
            <div
              ref="dropzone"
              class="w-full border-2 bg-white border-dashed border-gray-300 rounded-md p-6 text-center cursor-pointer hover:border-[#FA812F] transition relative"
              :class="{ 'opacity-50 cursor-not-allowed': isImageUploading }"
            >
              <div
                v-if="isImageUploading"
                class="absolute inset-0 flex items-center justify-center bg-white/50"
              >
                <span class="text-[#FA812F] font-bold">Uploading...</span>
              </div>
              <p class="text-gray-500">Drag & drop gambar di sini atau klik</p>
              <input
                type="file"
                ref="fileInput"
                accept="image/*"
                class="hidden"
                @change="onThumbnailChange"
              />
            </div>

            <!-- preview -->
            <div v-if="previewUrl" class="mt-3 relative">
              <div
                class="w-full max-h-64 border rounded-md overflow-hidden flex justify-center items-center bg-gray-100"
              >
                <img :src="getPreviewUrl(previewUrl)" class="max-w-full max-h-64 object-contain" />
              </div>

              <button
                type="button"
                @click="removeThumbnail"
                class="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 transition"
              >
                &times;
              </button>
            </div>
          </div>

          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-1">Konten</label>
            <div ref="editor" class="bg-white min-h-[500px]"></div>
          </div>

          <div class="mb-6 flex items-center justify-between rounded-md border border-[#FAB12F] bg-white p-4">
            <div>
              <label for="article-published" class="block text-sm font-medium text-gray-700">
                Publish artikel
              </label>
              <p class="text-xs text-gray-500">
                Jika tidak dicentang, artikel disimpan sebagai draft.
              </p>
            </div>
            <input
              id="article-published"
              v-model="form.isPublished"
              type="checkbox"
              class="h-5 w-5 rounded border-gray-300 text-[#FA812F] focus:ring-[#FA812F]"
            />
          </div>

          <div class="flex justify-end gap-3">
            <button
              type="button"
              @click="router.back()"
              class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="isLoading || isImageUploading"
              class="px-4 py-2 bg-[#FA812F] text-white rounded-md hover:bg-[#E67300] transition flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="isLoading" class="mr-2">Saving...</span>
              {{ isEdit ? 'Save Changes' : 'Save' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </AhliGiziLayout>
</template>

<script setup lang="ts">
import AhliGiziLayout from '@/components/layout/Ahligizi/AhliGiziLayout.vue'
import { ref, onMounted, reactive, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Quill from 'quill'
import 'quill/dist/quill.snow.css'
import { useArticle } from '@/composables/useArticle'
import type { ArticlePayload } from '@/types/article'
import Swal from 'sweetalert2'
import { ImageUrl } from '@/utils/baseURL'
import { resolveArticleContentImages } from '@/utils/articleContent'

const route = useRoute()
const router = useRouter()
const {
  isLoading,
  isImageUploading,
  fetchArticle,
  saveArticle,
  handleThumbnailUpload,
  handleContentImageUpload,
} = useArticle()

const editor = ref<HTMLElement | null>(null)
const dropzone = ref<HTMLElement | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)

const previewUrl = ref<string | null>(null)
const thumbnailFile = ref<File | null>(null)
const form = reactive({
  title: '',
  thumbnail: '',
  isPublished: false,
})
const isEdit = computed(() => !!route.params.id)
const articleId = computed(() => Number(route.params.id))

const getPreviewUrl = (url: string | null) => {
  if (!url) return ''
  if (url.startsWith('blob:') || url.startsWith('http://') || url.startsWith('https://')) {
    return url
  }
  return ImageUrl(url)
}

const toolbarOptions = [
  ['bold', 'italic', 'underline'],
  [{ header: [1, 2, false] }],
  [{ list: 'ordered' }, { list: 'bullet' }],
  ['link', 'image'],
  ['clean'],
]
let quill: Quill

onMounted(async () => {
  // Init Quill
  if (editor.value) {
    quill = new Quill(editor.value, {
      theme: 'snow',
      modules: {
        toolbar: {
          container: toolbarOptions,
          handlers: {
            image: quillImageHandler,
          },
        },
      },
    })
  }

  dropzone.value?.addEventListener('click', () => {
    if (!isImageUploading.value) {
      fileInput.value?.click()
    }
  })

  if (isEdit.value) {
    try {
      const article = await fetchArticle(articleId.value)
      if (article) {
        form.title = article.judul
        form.isPublished = article.is_published
        if (article.thumbnail_url) {
          form.thumbnail = article.thumbnail_url
          previewUrl.value = article.thumbnail_url
        }
        if (quill && article.konten) {
          // Setting HTML content to Quill
          const delta = quill.clipboard.convert({ html: resolveArticleContentImages(article.konten) })
          quill.setContents(delta, 'silent')
        }
      }
    } catch (e) {
      Swal.fire({
        icon: 'error',
        title: 'Gagal memuat artikel',
        text: 'Terjadi kesalahan saat memuat artikel',
      })
    }
  }
})

const onThumbnailChange = async (e: Event) => {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file || !file.type.startsWith('image/')) {
    Swal.fire({
      icon: 'warning',
      title: 'File tidak valid',
      text: 'File harus berupa gambar',
    })
    return
  }
  if (previewUrl.value?.startsWith('blob:')) {
    URL.revokeObjectURL(previewUrl.value)
  }
  thumbnailFile.value = file
  previewUrl.value = URL.createObjectURL(file)

  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const removeThumbnail = () => {
  if (previewUrl.value?.startsWith('blob:')) {
    URL.revokeObjectURL(previewUrl.value)
  }
  form.thumbnail = ''
  previewUrl.value = null
  thumbnailFile.value = null
}

const quillImageHandler = () => {
  const input = document.createElement('input')
  input.setAttribute('type', 'file')
  input.setAttribute('accept', 'image/*')
  input.click()

  input.onchange = async () => {
    const file = input.files?.[0]
    if (!file) return

    try {
      const url = await handleContentImageUpload(file)
      if (url) {
        const range = quill.getSelection(true)
        quill.insertEmbed(range.index, 'image', getPreviewUrl(url))
        quill.setSelection(range.index + 1, 0)
      }
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Gagal mengupload gambar',
        text: 'Terjadi kesalahan saat mengupload gambar',
      })
    }
  }
}

const handleSubmit = async () => {
  const content = quill.root.innerHTML

  if (!form.title.trim()) {
    Swal.fire('Peringatan', 'Judul tidak boleh kosong', 'warning')
    return
  }

  if (!content || content === '<p><br></p>') {
    Swal.fire('Peringatan', 'Konten artikel tidak boleh kosong', 'warning')
    return
  }

  try {
    // Jika ada file thumbnail baru, upload dulu sebelum submit artikel
    if (thumbnailFile.value) {
      const url = await handleThumbnailUpload(thumbnailFile.value)
      if (url) {
        form.thumbnail = url
      }
    }

    const payload: ArticlePayload = {
      judul: form.title,
      thumbnail_url: form.thumbnail || null,
      konten: content,
      is_published: form.isPublished,
    }

    if (!isEdit.value) {
      const userIdStr = localStorage.getItem('id')
      payload.user_id = userIdStr ? parseInt(userIdStr, 10) : 1
    }

    await saveArticle(payload, isEdit.value ? articleId.value : undefined)
    Swal.fire('Berhasil!', 'Artikel berhasil disimpan!', 'success')
    router.push('/ahligizi/artikel')
  } catch (err) {
    console.error('Submit error', err)
    Swal.fire('Error', 'Terjadi kesalahan saat menyimpan artikel', 'error')
  }
}
</script>
