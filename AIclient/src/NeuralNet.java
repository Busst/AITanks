import java.util.List;

public class NeuralNet {

    private String id;

    private NeuralNetLayer inputLayer;

    private List<NeuralNetLayer> hiddenLayer;

    private NeuralNetLayer outputLayer;

    public NeuralNet(String id, NeuralNetLayer inputLayer, List<NeuralNetLayer> hiddenLayer, NeuralNetLayer outputLayer) {
        this.id = id;
        this.inputLayer = inputLayer;
        this.hiddenLayer = hiddenLayer;
        this.outputLayer = outputLayer;
    }

    public NeuralNet(String id, NeuralNetLayer inputLayer, NeuralNetLayer outputLayer) {
        this.id = id;
        this.inputLayer = inputLayer;
        this.outputLayer = outputLayer;
    }
}
