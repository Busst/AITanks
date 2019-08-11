public class InputNode extends Node {

    private double data;
    public InputNode() {
        super();

    }

    public void start(double data){
        this.data = data;
    }

    @Override
    public double getInputs() {
        this.setZ(data);
        return data;
    }

    @Override
    public double getActivation() {
        this.setA(data);
        return data;
    }
}
