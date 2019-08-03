import java.util.ArrayList;
import java.util.List;

public class Test {

    public static void main(String[] args) {
        /**
         * neural network model
         * list of node's doesn't matter at first since we can assign connections later
         * list of connections, also can assign later
         * need input node, input node has as many connections as next layer nodes
         */

        int NODE_NUM = 10;
        List<Neuron> neuronList = new ArrayList<>();
        for (int i = 0; i < NODE_NUM; i++) {
            neuronList.add(new Neuron());
        }

        List<NeuralNetLayer> neuralNetLayerList = new ArrayList<>();
        for (int i = 0; i < 3; i++) {
            List<Neuron> neurons = new ArrayList<>();
            neurons.add(neuronList.remove(0));
            neurons.add(neuronList.remove(0));
            neurons.add(neuronList.remove(0));
            neuralNetLayerList.add(new NeuralNetLayer(""+(i + 1), neurons));
        }

        for (int i = 0; i < neuralNetLayerList.size()-1; i++) {
            NeuralNetLayer fromNNL = neuralNetLayerList.get(i);
            NeuralNetLayer toNNL = neuralNetLayerList.get(i+1);
            List<Neuron> fromNLLNeurons =  fromNNL.getNeurons();
            List<Neuron> toNLLNeurons =  toNNL.getNeurons();

            for (int j = 0; j < fromNLLNeurons.size(); j++) {
                for (int k = 0; k < toNLLNeurons.size(); k++) {
                    Neuron from = fromNLLNeurons.get(j);
                    Neuron to = toNLLNeurons.get(k);
                    NeuronsConnection nc = new NeuronsConnection(from, to);
                    from.addOutputConnection(nc);
                    to.addInputConnection(nc);
                }
            }

        }
        List<NeuralNetLayer> hiddenLayers = new ArrayList<>();
        hiddenLayers.add(neuralNetLayerList.get(1));
        NeuralNet ANN = new NeuralNet("My First ANN", neuralNetLayerList.get(0), hiddenLayers, neuralNetLayerList.get(2));

    }

    public class InputNeuron {
        private Neuron toNeuron;
    }

}
