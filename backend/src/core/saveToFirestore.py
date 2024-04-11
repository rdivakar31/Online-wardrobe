from firebase_admin import firestore
# from datetime import datetime

def save_to_firestore(outfit_url, file_name, user_id):
    db = firestore.client()
    ootd_collection = db.collection('OOTD')
    
    # 创建一个新的文档s
    doc_ref = ootd_collection.document()
    doc_ref.set({
        'user_id': user_id,
        'outfit_url': outfit_url,
        'created_at': firestore.SERVER_TIMESTAMP,  # 使用服务器时间戳
        'file_name': file_name
    })

    return doc_ref.id


# def save_to_firestore(outfit_url, user_id):
#     db = firestore.client()
#     # 首先，获取或创建一个以 user_id 为 ID 的文档
#     user_doc_ref = db.collection('OOTD').document(user_id)
    
#     # 然后，在该文档下创建一个子集合，比如叫做 "outfits"
#     # 在 "outfits" 子集合中创建一个新的文档
#     new_outfit_ref = user_doc_ref.collection('outfits').document()
    
#     # 设置新文档的数据
#     new_outfit_ref.set({
#         'outfit_url': outfit_url,
#         'created_at': firestore.SERVER_TIMESTAMP  # 使用服务器时间戳
#     })

#     return new_outfit_ref.id

