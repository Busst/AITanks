public class Connection {
    private Node inputNode;
    private Node outputNode;

    private double weight;

    private Boolean resolved;
    private double error;
    private double sigma_thing = 0d;

    public Connection() {
        weight = Math.random()*2;
        resolved = true;
        error = 0d;
    }
    public Connection(Node from, Node to) {
        this();
        inputNode = from;
        outputNode= to;
    }
    public Connection(double weight) {
        this.weight = weight;
    }

    public double getUnweightedInput() {
        return inputNode.getA();
    }

    public double getWeightedInput() {
        double strength = inputNode.getA() * weight;
        return strength;
    }

    public void setError(double error, double sig) {
        this.error = error;
        this.sigma_thing = sig;
        resolved = false;
    }

    public void resolveError(double learning_rate) {
        weight -= error * learning_rate;
        resolved = true;
    }

    public double getSigma_thing() {
        return sigma_thing;
    }

    public double getError() {
        return error;
    }

    public Node getInputNode() {
        return inputNode;
    }

    public void setInputNode(Node inputNode) {
        this.inputNode = inputNode;
    }

    public Node getOutputNode() {
        return outputNode;
    }

    public void setOutputNode(Node outputNode) {
        this.outputNode = outputNode;
    }

    public double getWeight() {
        return weight;
    }

    public void setWeight(double weight) {
        this.weight = weight;
    }
}
