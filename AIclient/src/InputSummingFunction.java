import java.sql.Connection;
import java.util.List;

public interface InputSummingFunction {
    double getOutput(List<NeuronsConnection> inputConnection);
}
