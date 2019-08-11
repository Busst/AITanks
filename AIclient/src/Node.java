import java.util.ArrayList;
import java.util.List;

public class Node {
    static int ID = 0;
    private int id = ID++;

    private List<Connection> inputConnection;
    private List<Connection> outputConnection;

    private double z;
    private double a;
    private double bias;

    private ActivationFunction activationFunction;
    //private ActivationFunction activationFunction;

    public Node() {
        this.bias = 0d;//Math.random() * 5 - 2.5;
        activationFunction = new TestActivationFunction();
        outputConnection = new ArrayList<>();
        inputConnection = new ArrayList<>();
    }

    public void feedForward() {
        getInputs();
        getActivation();

    }

    public double getInputs() {
        double z = 0d;
        for (Connection c :
                inputConnection) {
            z += c.getWeightedInput();
        }
        z += bias;
        this.z = z;
        return z;
    }

    public double getActivation() {
        double activation = activationFunction.getActivation(z);
        this.a = activation;
        return activation;
    }

    public void addOutputConnection(Connection c) {
        outputConnection.add(c);
    }
    public void addInputConnection(Connection c) {
        inputConnection.add(c);
    }

    public double getDerivative() {
        return activationFunction.getDerivative(z);
    }




    public int getID() {
        return id;
    }

    public List<Connection> getInputConnection() {
        return inputConnection;
    }

    public void setInputConnection(List<Connection> inputConnection) {
        this.inputConnection = inputConnection;
    }

    public List<Connection> getOutputConnection() {
        return outputConnection;
    }

    public void setOutputConnection(List<Connection> outputConnection) {
        this.outputConnection = outputConnection;
    }

    public double getZ() {
        return z;
    }

    public void setZ(double z) {
        this.z = z;
    }

    public double getA() {
        return a;
    }

    public void setA(double a) {
        this.a = a;
    }

    public double getBias() {
        return bias;
    }

    public void setBias(double bias) {
        this.bias = bias;
    }
}
