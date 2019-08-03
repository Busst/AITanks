import java.util.ArrayList;
import java.util.List;

public class Neuron {
    private String id;

    /**
     * Collection of neurons's input connections (to neuron)
     */
    private List<NeuronsConnection> inputConnection;
    /**
     * Collection of neurons's output connections (away from neuron)
     */
    private List<NeuronsConnection> outputConnection;

    private InputSummingFunction inputSummingFunction;

    private ActivationFunction activationFunction;

    public Neuron() {
        this.inputConnection = new ArrayList<>();
        this.outputConnection = new ArrayList<>();
        inputSummingFunction = new WeightedSumFunction();
    }

    public double calculateOutput() {
        double totalInput = inputSummingFunction.getOutput(inputConnection);
        return activationFunction.getOutput(totalInput);
    }
    public void addOutputConnection(NeuronsConnection nc) {
        outputConnection.add(nc);
    }
    public void addInputConnection(NeuronsConnection nc) {
        inputConnection.add(nc);
    }


}
