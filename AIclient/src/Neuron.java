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

    protected double Z;
    protected double A;
    protected double bias;

    public Neuron() {
        this.inputConnection = new ArrayList<>();
        this.outputConnection = new ArrayList<>();
        inputSummingFunction = new WeightedSumFunction();
        activationFunction = new Sigmoid();
        this.bias = Math.random();
    }

    public void calculateZ() {
        this.Z = inputSummingFunction.getOutput(inputConnection) + bias;

    }
    public double getZ() {
        return Z;
    }

    public void calculateActivation() {
        this.A = activationFunction.getOutput(Z);
        //System.out.println("Neuron:\n\tZ: " + Z +"\n\tA: "+A);
    }

    public double getA() {
            return A;
    }

    public void feedForward() {
        calculateZ();
        calculateActivation();
    }

    public double sumOfInputs() {
        double sumOfA = 0d;
        for (NeuronsConnection nc: inputConnection) {
            sumOfA += nc.getInput();
        }
        return sumOfA;
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

    public List<NeuronsConnection> getInputConnection(){
        return inputConnection;
    }

    public List<NeuronsConnection> getOutputConnection() {
        return outputConnection;
    }
}
