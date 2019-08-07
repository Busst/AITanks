import java.util.ArrayList;
import java.util.DuplicateFormatFlagsException;
import java.util.List;

public class NeuralNet {

    private String id;

    private NeuralNetLayer inputLayer;

    private List<NeuralNetLayer> hiddenLayer;

    private NeuralNetLayer outputLayer;

    private List<Double> output;

    private ActivationFunction activationFunction;

    private double LEARNING_RATE = 5;

    public NeuralNet(String id, NeuralNetLayer inputLayer, List<NeuralNetLayer> hiddenLayer, NeuralNetLayer outputLayer) {
        this.id = id;
        this.inputLayer = inputLayer;
        this.hiddenLayer = hiddenLayer;
        this.outputLayer = outputLayer;
        output = new ArrayList<>();
        activationFunction = new Sigmoid();
    }

    public NeuralNet(String id, NeuralNetLayer inputLayer, NeuralNetLayer outputLayer) {
        this.id = id;
        this.inputLayer = inputLayer;
        this.outputLayer = outputLayer;
    }
    //no connections added

    public NeuralNet(String id, NeuralNetLayer inputLayer, List<NeuralNetLayer> hiddenLayer, NeuralNetLayer outputLayer, Boolean connected) {

        this.id = id;
        this.inputLayer = inputLayer;
        this.hiddenLayer = hiddenLayer;
        this.outputLayer = outputLayer;
        output = new ArrayList<>();
        activationFunction = new Sigmoid();
        if (connected){
            return;
        }
        for (Neuron from: inputLayer.getNeurons()) {
            for (Neuron to: hiddenLayer.get(0).getNeurons()) {
                NeuronsConnection nc = new NeuronsConnection(from, to);
                from.addOutputConnection(nc);
                to.addInputConnection(nc);
            }
        }
        for (Neuron to: outputLayer.getNeurons()) {
            for (Neuron from: hiddenLayer.get(hiddenLayer.size()-1).getNeurons()) {
                NeuronsConnection nc = new NeuronsConnection(from, to);
                from.addOutputConnection(nc);
                to.addInputConnection(nc);
            }
        }
        for (int i = 0; i < hiddenLayer.size() - 1; i++) {
            for (Neuron from: hiddenLayer.get(i).getNeurons()) {
                for (Neuron to: hiddenLayer.get(i+1).getNeurons()) {
                    //System.out.println("connection added for hidden");
                    NeuronsConnection nc = new NeuronsConnection(from, to);
                    from.addOutputConnection(nc);
                    to.addInputConnection(nc);
                }
            }
        }
    }

    public List<Double> feedForward() {
        output = new ArrayList<>();
        for (Neuron n: inputLayer.getNeurons()) {
            n.feedForward();
        }
        //System.out.println("input done");
        int i = 1;
        for (NeuralNetLayer nnl: hiddenLayer) {
            //System.out.println("hidden layer " + i++);
            for (Neuron n: nnl.getNeurons()){
                n.feedForward();
            }
        }
        for (Neuron n: outputLayer.getNeurons()) {
            n.feedForward();
            output.add(n.getA());
        }
        return output;
    }

    public void backPropagate(List<Double> expected) {
        if (expected.size() != output.size()) {
            System.out.println("error in expected size");
            return;
        }
        for (int i = 0; i < expected.size(); i++) {
            Neuron outNeuron = outputLayer.getNeurons().get(i);
            double expected_value = expected.get(i);
            for (NeuronsConnection inputConnection: outNeuron.getInputConnection()) {
                inputConnection.newWeight(getWeightPartial(outNeuron, inputConnection, expected_value));
            }
        }
        for (NeuralNetLayer neuralNetLayer: hiddenLayer) {
            for (Neuron n: neuralNetLayer.getNeurons()) {
                for (NeuronsConnection inputConnection: n.getInputConnection()) {
                    inputConnection.newWeight(hiddenLayerWeightPartial(n, inputConnection));
                }
            }
        }

        for (Neuron neuron: outputLayer.getNeurons()) {
            for (NeuronsConnection nc: neuron.getInputConnection()) {
                nc.resolveWeight(LEARNING_RATE);
            }
        }
        for (NeuralNetLayer nnl: hiddenLayer) {
            for (Neuron neuron: nnl.getNeurons()) {
                for (NeuronsConnection nc: neuron.getInputConnection()) {
                    nc.resolveWeight(LEARNING_RATE);
                }
            }
        }

    }

    public void setOutput(List<Double> output) {
        this.output = output;
    }
    private double getDa_Dz(Neuron neuron) {
        return activationFunction.getOutputDerivative(neuron.getA());
    }

    private double getWeightPartial(Neuron neuron, NeuronsConnection nc, double expected) {
        double da_dz = getDa_Dz(neuron);          //Partial out / partial net (always needed)
        double dz_dw = nc.getInput();               //fromNeuron activation number  (always needed changes based on connection)
        double dc_da = output.get(0) - expected;
        return dz_dw * da_dz * dc_da;
    }

    private double hiddenLayerWeightPartial(Neuron neuron, NeuronsConnection nc){
        double da_dz = getDa_Dz(neuron);          //Partial out / partial net (always needed)
        double dz_dw = nc.getInput();               //fromNeuron activation number  (always needed changes based on connection)
        double dc_da = 0d;
        for (NeuronsConnection outputConnection: neuron.getOutputConnection()) {
            double temp = outputConnection.getErrorWeight();
            temp *= activationFunction.getOutputDerivative(outputConnection.toNeuron.getA());
            temp *= outputConnection.getWeight();
            dc_da += temp;
        }
        return da_dz * dz_dw * dc_da;
    }
    /**
     *
     *
     *
     */
    private double hiddenLayerErrorOutPartial(Neuron neuron, NeuronsConnection nc, List<Double> expected) {
        double dc_da = 0d;
        double derr_dnet = 0;
        for (int i = 0; i < expected.size(); i++) {//repeats for every connection to the next layer
            dc_da = 2 * (expected.get(i) - output.get(i)); //error of one output of a toNeuron
            dc_da *= activationFunction.getOutputDerivative(neuron.getZ()); //activation derivative of toNeuron
            //multiply by weight in connection toNeuron
            derr_dnet += dc_da;
        }
        double dout_dnet = activationFunction.getOutputDerivative(neuron.getA());
        double dnet_dw = nc.getWeight();

        return 0d;
    }





//    private double getBiasProportion(Neuron neuron, List<Double> expected) {
//        double da_dz = activationFunction.getOutputDerivative(neuron.getZ());
//        double dz_dw = 1;
//        double dc_da = 0d;
//        for (int i = 0; i < expected.size(); i++) {
//            dc_da += 2 * (expected.get(i) - output.get(i));
//        }
//        return da_dz * dz_dw * dc_da * LEARNING_RATE;
//    }

    public void setInputs(List<Double> input) {
        for (int i = 0; i < input.size(); i++) {
            double d = input.get(i);
            for (int j = 0; j < inputLayer.getNeurons().size(); j++) {
                InputNeuron in = (InputNeuron) inputLayer.getNeurons().get(i);
                in.setInput(d);
            }
        }
    }
}
