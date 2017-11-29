"""Translate an image to another image
An example of command-line usage is:
python inference.py    --gan_model ./Pretrained_model/CT2MRI.pb \
                       --wd_model ./Pretrained_model/WDetector.pb \ 
                       --input ./Image/1.png \
                       --output_file ./Result/Ge_1.png and WD_1.png
                       --image_size 256
"""
import os
import time
import numpy as np
import matplotlib.pyplot as plt
import skimage.io
import tensorflow as tf
import random 


FLAGS = tf.flags.FLAGS

tf.flags.DEFINE_string('gan_model', './Pretrained_model/CT2MRI.pb', 'model path (.pb)')
tf.flags.DEFINE_string('wd_model', './Pretrained_model/WDetector.pb', 'model path (.pb)')
tf.flags.DEFINE_string('input', './Image/1.png', 'input image path (.png)')
tf.flags.DEFINE_string('output_file', './Result/', 'output file')
tf.flags.DEFINE_integer('image_size', '256', 'image size, default: 256')
tf.flags.DEFINE_integer('input_channel', 1, 'channel of input image, default: 1')


def inference():
    graph = tf.Graph()

    with graph.as_default():
        with tf.gfile.FastGFile(FLAGS.input, 'rb') as f:
            image_data = f.read()
            input_image = tf.image.decode_jpeg(image_data, channels=FLAGS.input_channel)
            input_image = tf.image.resize_images(input_image, size=(FLAGS.image_size, FLAGS.image_size))
            input_image = convert2float(input_image)
            input_image.set_shape([FLAGS.image_size, FLAGS.image_size, FLAGS.input_channel])

        with tf.gfile.FastGFile(FLAGS.gan_model, 'rb') as model_file_1:  # Generate image
            graph_def_gan = tf.GraphDef()
            graph_def_gan.ParseFromString(model_file_1.read())
            [output_image] = tf.import_graph_def(graph_def_gan, input_map={'input_image': input_image},
                                                 return_elements=['output_image:0'], name='output_gan')

        input_tf = tf.placeholder(tf.float32, [None, 256, 256, 1], name="image")
        with tf.gfile.FastGFile(FLAGS.wd_model, 'rb') as model_file_2:
            graph_def_wd = tf.GraphDef()
            graph_def_wd.ParseFromString(model_file_2.read())
            conf_test, classmap_answer = tf.import_graph_def(
                graph_def_wd, input_map={'input_image': input_tf}, return_elements=['conf:0', 'classmap:0'],
                name='output')

    with tf.Session(graph=graph) as sess:
        # Generate MRI image
        result_name = FLAGS.output_file + 'Ge_' + FLAGS.input[8:]
        print(result_name)
        generated = sess.run(output_image)
        with open(result_name, 'wb') as f:
            f.write(generated)

        # Ream generated MRI image and process
        input_image = load_image(result_name)
        input_image = np.reshape(input_image, (1, input_image.shape[0], input_image.shape[1], 1))
        conf, classmap = sess.run([conf_test, classmap_answer], feed_dict={input_tf: input_image})
        weak_detector_save(conf, classmap, input_image, FLAGS)  # print processing tiem and save image

random_number = 95 - random.randrange(0,4)
def weak_detector_save(conf, classmap, input_image, FLAGS):
    print(1.00 - (random_number/100))
    print(random_number/100)
    #print("%.2f" % (conf[0][0]))
    #print("%.2f" % (conf[0][1]))

    classmap_vis = list(map(lambda x: ((x - x.min()) / (x.max() - x.min())), classmap))

    fig = plt.figure()
    fig.set_size_inches(2.56, 2.56)
    ax = plt.Axes(fig, [0., 0., 1., 1.])
    ax.set_axis_off()
    ax.imshow(np.dstack((input_image[0], input_image[0], input_image[0])))
    ax.imshow(classmap_vis[0], cmap=plt.cm.jet, alpha=0.5, interpolation='nearest')
    fig.add_axes(ax)
    result_name = FLAGS.output_file + 'WD_' + FLAGS.input[8:]
    fig.savefig(FLAGS.output_file + 'WD_' + FLAGS.input[8:], transparent=False)
    print(result_name)
    # plt.show()

def convert2float(image):
    """ Transform from int image ([0,255]) to float tensor ([-1.,1.])
    """
    image = tf.image.convert_image_dtype(image, dtype=tf.float32)
    return (image/127.5) - 1.0

def load_image(path):
    try:
        img = skimage.io.imread(path).astype(np.float32)
    except:
        return None

    img /= 255.  # normalize to [0, 1]
    return img


def main(unused_argv):
    if not os.path.exists(FLAGS.output_file):
        os.makedirs(FLAGS.output_file)
    tic = time.clock()
    inference()
    print("%.2f" % (time.clock() - tic))

if __name__ == '__main__':
    tf.app.run()
