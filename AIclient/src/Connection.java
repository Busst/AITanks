public class Connection {
    private Node inputNode;
    private Node outputNode;

    private double weight;

    private Boolean resolved;
    private double error;

    public Connection() {
        weight = Math.random()*5 - 2.5;
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

    public void setError(double error) {
        this.error = error;
        resolved = false;
    }

    public void resolveError(double learning_rate) {
        weight -= error * learning_rate;
        resolved = true;
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
