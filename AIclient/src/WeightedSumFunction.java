
import java.util.List;

public class WeightedSumFunction implements InputSummingFunction {


    @Override
    public double getOutput(List<NeuronsConnection> inputConnection) {
        double weightSum = 0d;
        for (NeuronsConnection connection: inputConnection) {
            double temp = weightSum;
            double addAmount = connection.getWeightedInput();
            //System.out.println("adding "  + addAmount +" to " + temp);
            weightSum += addAmount;
        }
        //System.out.println("total: " + weightSum);
        return weightSum;
    }
}
