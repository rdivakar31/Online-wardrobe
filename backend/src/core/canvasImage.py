from PIL import Image
from io import BytesIO
from .config import CLOTHING_CATEGORIES

def dynamic_resize_and_place_images(images, canvas, layout, items_count):
    max_items_per_row = 3
    rows = (items_count + max_items_per_row - 1) // max_items_per_row
    
    for index, (img, (x, y, target_width, target_height)) in enumerate(zip(images, layout)):
        # 计算图片的原始宽高比和目标宽高比
        img_aspect_ratio = img.width / img.height
        target_aspect_ratio = target_width / target_height

        # 根据宽高比决定如何缩放图片
        if img_aspect_ratio > target_aspect_ratio:
            scaled_width = target_width
            scaled_height = int(target_width / img_aspect_ratio)
        else:
            scaled_height = target_height
            scaled_width = int(target_height * img_aspect_ratio)

        # 缩放图片
        img_resized = img.resize((scaled_width, scaled_height), Image.Resampling.LANCZOS)

        # 计算图片放置位置
        # x_offset = x + (target_width - scaled_width) // 2
        # row_of_item = index // max_items_per_row
        # if row_of_item < 1:  # 第一行的图片，横向下边缘对齐
        #     y_offset = y + (target_height - scaled_height)
        # else:  # 第二行及之后的图片，横向上边缘对齐
        #     y_offset = y
        x_offset = x + (target_width - scaled_width) // 2
        if index < max_items_per_row:  # 第一行的图片，横向下边缘对齐
            y_offset = y + (target_height - scaled_height)
        else:  # 第二行及之后的图片，横向上边缘对齐
            y_offset = y

        # 将图片粘贴到画布上
        canvas.paste(img_resized, (x_offset, y_offset), img_resized)

def compute_layout(category_counts, canvas_width, canvas_height):
    layout = []
    # 计算每行的物品数量和高度
    top_items = min(category_counts['top'] + category_counts['accessories'], 3)
    overflow_top_items = max(category_counts['top'] + category_counts['accessories'] - 3, 0)
    bottom_items = category_counts['bottom'] + category_counts['shoes'] + overflow_top_items
    top_row_height = canvas_height // 2 if bottom_items > 0 else canvas_height
    bottom_row_height = canvas_height // 2 if top_items > 0 else 0

    # 动态计算第一行的物品宽度
    item_width_top = canvas_width // top_items if top_items else 0
    for i in range(top_items):
        x = i * item_width_top
        layout.append((x, 0, item_width_top, top_row_height))  # Top row

    # 动态计算第二行的物品宽度
    bottom_items = max(bottom_items, 1)  # 防止除零错误
    item_width_bottom = canvas_width // bottom_items
    for i in range(bottom_items):
        x = i * item_width_bottom
        layout.append((x, top_row_height, item_width_bottom, bottom_row_height))  # Bottom row

    return layout

def compose_outfit_image(items_data, canvas_width=300, canvas_height=380):
    if len(items_data) == 0:
        raise ValueError("Please select some items to create an outfit.")
    if len(items_data) > 6:
        raise ValueError("The maximum number of items for an outfit is 6.")

    canvas = Image.new('RGBA', (canvas_width, canvas_height), (0, 0, 0, 0))

    # 按类别组织图片
    images_by_category = {'top': [], 'accessories': [], 'bottom': [], 'shoes': []}
    
    for item_data in items_data:
        category = CLOTHING_CATEGORIES.get(item_data['category'], 'accessories')
        img = Image.open(item_data['bytes_io']).convert('RGBA')
        images_by_category[category].append(img)

    # 重新计算每个类别的计数
    category_counts = {cat: len(images) for cat, images in images_by_category.items()}

    # 分类图片，并处理超过3件的上衣和装饰情况
    top_accessories = images_by_category['top'] + images_by_category['accessories']
    bottom_shoes = images_by_category['bottom'] + images_by_category['shoes']
    sorted_images = top_accessories[:3]  # 保持前三个在第一行
    if len(top_accessories) > 3:
        overflow = top_accessories[3:]  # 将多余的放到第二行
        sorted_images += bottom_shoes + overflow  # 将裤子和鞋子与多余的上衣/装饰合并
    else:
        sorted_images += bottom_shoes  # 如果没有多余的，正常合并

    # 调用compute_layout和dynamic_resize_and_place_images
    # 注意我们将category_counts传递给compute_layout
    layout = compute_layout(category_counts, canvas_width, canvas_height)
    dynamic_resize_and_place_images(sorted_images, canvas, layout, len(sorted_images))

    # 将最终的画布缩放并保存
    final_canvas = canvas.resize((canvas_width, canvas_height), Image.Resampling.LANCZOS)
    outfit_image_io = BytesIO()
    final_canvas.save(outfit_image_io, format='PNG')
    outfit_image_io.seek(0)

    return outfit_image_io




















