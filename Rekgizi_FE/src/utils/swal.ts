import Swal from 'sweetalert2'

export const success = (message: string) => {
    return Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'message'
    })
}

export const error = (message: string ) => {
    return Swal.fire({
        icon: 'error',
        title: 'Error',
        text: message
    })
}

export const confirmAction = async ({
    title,
    text,
    confirmText ="Ok",
    action
}:{
    title: string
    text? : string
    confirmText?: string
    action: ()=> Promise<any>
}) => {
    const result = await Swal.fire({
        title,
        text,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: confirmText,
        cancelButtonText : "Cancel",
        showLoaderOnConfirm: true,

        preConfirm: async () =>{
            try{
                await action()
            } catch {
                Swal.showValidationMessage("Request Gagal")
            }
        }
    })
    return result.isConfirmed
}
 