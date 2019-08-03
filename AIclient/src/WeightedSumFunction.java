
import java.util.List;

public class WeightedSumFunction implements InputSummingFunction {


    @Override
    public double getOutput(List<NeuronsConnection> inputConnection) {
        double weightSum = 0d;
        for (NeuronsConnection connection: inputConnection) {
            weightSum += connection.getWeightedInput();
        }
        return weightSum;
    }
}
