import numpy as np
import tensorflow as tf
import random
import scipy.misc


def convert2int(image):
    """ transform from float tensor ([-1.,1.]) to int image ([0,255])
    """
    return tf.image.convert_image_dtype((image+1.0)/2.0, tf.uint8)


def convert2float(image):
    """ Transform from int image ([0,255]) to float tensor ([-1.,1.])
    """
    image = tf.image.convert_image_dtype(image, dtype=tf.float32)
    return (image/127.5) - 1.0


def batch_convert2int(images):
    """
    Args:
      images: 4D float tensor (batch_size, image_size, image_size, depth)
    Returns:
      4D int tensor
    """
    return tf.map_fn(convert2int, images, dtype=tf.uint8)


def batch_convert2float(images):
    """
    Args:
      images: 4D int tensor (batch_size, image_size, image_size, depth)
    Returns:
      4D float tensor
    """
    return tf.map_fn(convert2float, images, dtype=tf.float32)


class ImagePool:
    """ History of generated images
      Same logic as https://github.com/junyanz/CycleGAN/blob/master/util/image_pool.lua
    """
    def __init__(self, pool_size):
        self.pool_size = pool_size
        self.images = []

    def query(self, image):
        if self.pool_size == 0:
            return image

        if len(self.images) < self.pool_size:
            self.images.append(image)
            return image
        else:
            p = random.random()
            if p > 0.5:
                # use old image
                random_id = random.randrange(0, self.pool_size)
                tmp = self.images[random_id].copy()
                self.images[random_id] = image.copy()
                return tmp
            else:
                return image


def load_data(image_path, flip=True, is_test=False):
    img_a, img_b = load_image(image_path)
    # print('img a shape: ', img_a.shape)
    # print('img b shape: ', img_b.shape)

    img_a, img_b = preprocess_a_and_b(img_a, img_b, flip=flip, is_test=is_test)

    img_a = img_a / 127.5 - 1.
    img_b = img_b / 127.5 - 1.

    img_a = np.reshape(img_a, (img_a.shape[0], img_a.shape[1], 1))
    img_b = np.reshape(img_b, (img_b.shape[0], img_b.shape[1], 1))
    # img_ab = np.concatenate((img_a, img_b), axis=2)

    return img_a, img_b


def load_image(image_path):
    # print('image path:', image_path)

    input_img = imread(image_path)
    w = int(input_img.shape[1])
    w2 = int(w/2)
    img_a = input_img[:, 0:w2]
    img_b = input_img[:, w2:w]

    return img_a, img_b


def preprocess_a_and_b(img_a, img_b, load_size=286, fine_size=256, flip=True, is_test=False):
    if is_test:
        img_a = scipy.misc.imresize(img_a, [fine_size, fine_size])
        img_b = scipy.misc.imresize(img_b, [fine_size, fine_size])
    else:
        img_a = scipy.misc.imresize(img_a, [load_size, load_size])
        img_b = scipy.misc.imresize(img_b, [load_size, load_size])

        h1 = int(np.ceil(np.random.uniform(1e-2, load_size-fine_size)))
        w1 = int(np.ceil(np.random.uniform(1e-2, load_size-fine_size)))
        img_a = img_a[h1:h1+fine_size, w1:w1+fine_size]
        img_b = img_b[h1:h1+fine_size, w1:w1+fine_size]

        if flip and np.random.random() > 0.5:
            img_a = np.fliplr(img_a)
            img_b = np.fliplr(img_b)

    return img_a, img_b


def imread(path, is_gray_scale=True):
    if is_gray_scale:
        return scipy.misc.imread(path, flatten=True).astype(np.float)
    else:
        return scipy.misc.imread(path).astype(np.float)


def save_images(gt, b, a, size, image_path):
    return imsave(inverse_transform(gt), inverse_transform(b), inverse_transform(a), size, image_path)


def imsave(gt, b, a, batch_size, path):
    img_size = 256
    # gt, b, a shape: [N, H, W, 1]

    for index in range(batch_size[0]):
        new_img = np.zeros((img_size, 3 * img_size))
        new_img[:, 0:img_size] = np.squeeze(gt)
        new_img[:, img_size:2 * img_size] = np.squeeze(b)
        new_img[:, 2 * img_size:3 * img_size] = np.squeeze(a)

        new_path = path[:-4] + "_" + str(index) + path[-4:]
        scipy.misc.imsave(new_path, new_img)


def inverse_transform(images):
    return (images + 1.) / 2.


def data_file(data_phase, training=True):
    if training is True:
        if data_phase == 0:
            return '../datasets/CT_MRI_Unpaired_2/tfrecords/CT_train_all.tfrecords', \
                '../datasets/CT_MRI_Unpaired_2/tfrecords/MRI_train_all.tfrecords', \
                '../datasets/CT_MRI_Unpaired_2/valCT_all/'
        elif data_phase == 1:
            return '../datasets/CT_MRI_Unpaired_2/tfrecords/CT_train_P1.tfrecords', \
                '../datasets/CT_MRI_Unpaired_2/tfrecords/MRI_train_P1.tfrecords', \
                '../datasets/CT_MRI_Unpaired_2/valCT_P1/'
        elif data_phase == 2:
            return '../datasets/CT_MRI_Unpaired_2/tfrecords/CT_train_P2.tfrecords', \
                '../datasets/CT_MRI_Unpaired_2/tfrecords/MRI_train_P2.tfrecords', \
                '../datasets/CT_MRI_Unpaired_2/valCT_P2/'
        elif data_phase == 3:
            return '../datasets/CT_MRI_Unpaired_2/tfrecords/CT_train_P3.tfrecords', \
                '../datasets/CT_MRI_Unpaired_2/tfrecords/MRI_train_P3.tfrecords', \
                '../datasets/CT_MRI_Unpaired_2/valCT_P3/'
        elif data_phase == 4:
            return '../datasets/CT_MRI_Unpaired_2/tfrecords/CT_train_P4.tfrecords', \
                '../datasets/CT_MRI_Unpaired_2/tfrecords/MRI_train_P4.tfrecords', \
                '../datasets/CT_MRI_Unpaired_2/valCT_P4/'
    elif training is False:
        if data_phase == 0:
            return '../datasets/CT_MRI_Unpaired_2/testCT_all/'
        elif data_phase == 1:
            return '../datasets/CT_MRI_Unpaired_2/testCT_P1/'
        elif data_phase == 2:
            return '../datasets/CT_MRI_Unpaired_2/testCT_P2/'
        elif data_phase == 3:
            return '../datasets/CT_MRI_Unpaired_2/testCT_P3/'
        elif data_phase == 4:
            return '../datasets/CT_MRI_Unpaired_2/testCT_P4/'
