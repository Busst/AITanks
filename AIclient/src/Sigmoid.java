public class Sigmoid implements ActivationFunction {
    @Override
    public double getOutput(double totalInput) {

        return 1.0 / (1.0 + Math.pow(Math.E, -totalInput));
    }

    @Override
    public double getOutputDerivative(double z) {
        return (getOutput(z) * (1.0 - getOutput(z)));
    }
}
