public class OutputNeuron extends Neuron {
    private ActivationFunction activationFunction;
    private double input;
    public OutputNeuron() {
        super();

        this.activationFunction = new Sigmoid();

    }

    public double calculateOutput() {
        return activationFunction.getOutput(this.input);
    }



}
