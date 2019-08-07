public interface ActivationFunction {
    double getOutput(double totalInput);

    double getOutputDerivative(double z);
}
