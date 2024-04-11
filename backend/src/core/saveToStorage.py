from firebase_admin import storage

def upload_to_firebase_storage(bytes_io, file_name, user_id):
    # 获取默认的 Storage 桶
    bucket = storage.bucket()
    
    # 构建文件完整路径，确保文件保存在 'outfits/' 目录下
    # 这是通过将 'outfits/' 前缀和文件名结合来实现的
    file_path = f'outfits/{user_id}/{file_name}'  # 比如 'outfits/{user_id}/uuid-generated-file-name.png'
    
    # 创建一个 Blob 对象指向该路径
    blob = bucket.blob(file_path)
    
    # 从 BytesIO 对象上传数据
    blob.upload_from_file(bytes_io, content_type='image/png')
    
    # 使文件公开可访问，并获取 URL
    blob.make_public()
    
    # 返回公开访问的 URL
    return blob.public_url

