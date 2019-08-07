public class InputNeuron extends Neuron {
    private ActivationFunction activationFunction;
    private double input;

    public InputNeuron(double input) {
        super();
        this.input = input;
        this.activationFunction = new Sigmoid();

    }

    public void calculateZ() {
        this.Z = this.input;
        //System.out.println("input " + Z);
    }

    public double calculateOutput() {
        return activationFunction.getOutput(this.input);
    }
    public void setInput(double input){
        this.input = input;
    }





}
