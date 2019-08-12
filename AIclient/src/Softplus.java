public class Softplus implements ActivationFunction {
    @Override
    public double getActivation(double z) {
        return Math.log(1 + Math.pow(Math.E,z));
    }

    @Override
    public double getDerivative(double z) {
        return 1/ (1 + Math.pow(Math.E, -z));
    }
}
