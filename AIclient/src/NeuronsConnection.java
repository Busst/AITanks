/**
 * represents a connection between neurons
 */

public class NeuronsConnection {
    /**
     * source neuron, input to this neuron
     */
    protected Neuron fromNeuron;
    /**
     * target neuron, output goes to toNeuron
     */
    protected Neuron toNeuron;

    /**
     * connection weight
     */
    protected double weight;

    private double newWeight;

    public NeuronsConnection(Neuron fromNeuron, Neuron toNeuron) {
        this.fromNeuron = fromNeuron;
        this.toNeuron = toNeuron;
        this.weight = Math.random();
    }
    public NeuronsConnection(Neuron fromNeuron, Neuron toNeuron, double weight) {
        this(fromNeuron, toNeuron);
        this.weight = weight;
    }

    public double getWeight() {
        return weight;
    }

    public void setWeight(double weight) {
        this.weight = weight;
    }
    public double getInput() {
        return fromNeuron.getA();
    }

    /**
     * Returns the weighted input of this connection
     *
     * @return weight of the input of the connection
     */
    public double getWeightedInput() {
        //System.out.println("Connection:\n\tfromNeuron.A: "+fromNeuron.getA()+"\n\tweight: " + weight);
        return fromNeuron.getA() * weight;
    }

    public void newWeight(double newWeight) {
        this.newWeight = newWeight;
    }

    public double getErrorWeight() {
        return newWeight;
    }

    public void resolveWeight(double learning_rate){
        //System.out.println(weight);
        this.weight = weight + newWeight * learning_rate;
        //System.out.println(weight);
    }


    public Neuron getFromNeuron() {
        return fromNeuron;
    }

    public Neuron getToNeuron() {
        return toNeuron;
    }
}

