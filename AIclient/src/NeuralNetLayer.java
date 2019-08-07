import java.util.ArrayList;
import java.util.List;

public class NeuralNetLayer {
    private String id;

    protected List<Neuron> neurons;

    public NeuralNetLayer(String id) {
        this.id = id;
        neurons = new ArrayList<>();
    }

    public NeuralNetLayer(String id, List<Neuron> neurons) {
        this.id = id;
        this.neurons = neurons;
    }

    public List<Neuron> getNeurons() {
        return neurons;
    }

    public void addNeuron(Neuron n) {
        neurons.add(n);
    }

    @Override
    public String toString() {
        String out = "";

        out += id + "\n";


        return out;
    }
}
