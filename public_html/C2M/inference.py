"""Translate an image to another image
An example of command-line usage is:
python inference.py    --model ./Pretrained_C2M/CT2MRI.pb \
                       --input ./Image/1.png \
                       --image_size 256
"""
import os
import time
import tensorflow as tf
import utils

FLAGS = tf.flags.FLAGS

tf.flags.DEFINE_string('model', './Pretrained_C2M/CT2MRI.pb', 'model path (.pb)')
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
            input_image = utils.convert2float(input_image)
            input_image.set_shape([FLAGS.image_size, FLAGS.image_size, FLAGS.input_channel])

        with tf.gfile.FastGFile(FLAGS.model, 'rb') as model_file:
            graph_def = tf.GraphDef()
            graph_def.ParseFromString(model_file.read())
            [output_image] = tf.import_graph_def(graph_def, input_map={'input_image': input_image},
                                                 return_elements=['output_image:0'], name='output')

    with tf.Session(graph=graph) as sess:
        result_name = FLAGS.output_file + 'Ge_' + FLAGS.input[8:]
        print(result_name)
        generated = output_image.eval()
        with open(result_name, 'wb') as f:
            f.write(generated)


def main(unused_argv):
    if not os.path.exists(FLAGS.output_file):
        os.makedirs(FLAGS.output_file)
    tic = time.clock()
    inference()
    print("%.2f" % (time.clock() - tic))

if __name__ == '__main__':
    tf.app.run()
