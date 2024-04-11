from rembg import remove

class RemoveBgService:
    def remove_background(self, image_data: bytes):
        result = remove(image_data)
        return result
