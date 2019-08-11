public class TestActivationFunction implements ActivationFunction {
    @Override
    public double getActivation(double  z) {
        return (z > 0) ? z : 0;
    }

    @Override
    public double getDerivative(double z) {
        return 1;
    }
}
