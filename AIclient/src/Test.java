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

        List<Neuron> input = new ArrayList<>();
        input.add(new InputNeuron(0));
        input.add(new InputNeuron(0));

        NeuralNetLayer inputLayer = new NeuralNetLayer("input Layer", input);
        List<NeuralNetLayer> hiddenLayers = new ArrayList<>();
        for (int k = 0; k < 5; k++) {
            List<Neuron> hiddenLayerList1 = new ArrayList<>();
            for (int i = 0; i < 100; i++) {
                hiddenLayerList1.add(new Neuron());
            }
            NeuralNetLayer hiddenLayer1 = new NeuralNetLayer("hidden layer 1", hiddenLayerList1);
            hiddenLayers.add(hiddenLayer1);
        }

        List<Neuron> outputLayerList = new ArrayList<>();
        outputLayerList.add(new Neuron());
        NeuralNetLayer outputLayer = new NeuralNetLayer("output layer", outputLayerList);

        NeuralNet ann = new NeuralNet("ann", inputLayer, hiddenLayers, outputLayer, false);
        List<Double> output= ann.feedForward();
        for (Double d: output) {
            System.out.println(d);
        }
        List<Double> expected = new ArrayList<>();
        List<Double> input1 = new ArrayList<>();
        input1.add(0d);
        input1.add(0d);

        expected.add(0d);
        for (int i = 0; i < 200; i++) {
            expected.set(0,0d);
            output = ann.feedForward();
            ann.backPropagate(expected);
            for (Double d: output) {
                System.out.println(d);
            }
        }

        System.out.println("**********************************************************");
        output= ann.feedForward();
        for (Double d: output) {
            System.out.println(d);
        }
        System.out.println("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^");
        System.out.println("**********************************************************");
        List<Double> inn = new ArrayList<>();
        inn.add(1d);
        inn.add(1d);
        ann.setInputs(inn);
        output= ann.feedForward();
        for (int i = 0; i < 100; i++) {
            //ann.backPropagate(expected);
        }
        for (Double d: output) {
            System.out.println(d);
        }

    }


}
