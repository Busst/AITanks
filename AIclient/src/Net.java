import java.util.ArrayList;
import java.util.List;

public class Net {

    private NodeLayer inputLayer;
    private NodeLayer outputLayer;
    private List<NodeLayer> hiddenLayers;
    private double LEARNING_RATE = .05;

    public Net(){
        //create new net
        inputLayer = new NodeLayer(2, true);
        hiddenLayers = new ArrayList<>();
        hiddenLayers.add(new NodeLayer(2, false, inputLayer));
        outputLayer = new NodeLayer(1, false, hiddenLayers.get(0));
    }
    public Net(NodeLayer inputLayer, NodeLayer outputLayer){
        this.inputLayer = inputLayer;
        this.outputLayer = outputLayer;
    }
    public Net(NodeLayer inputLayer, List<NodeLayer> hiddenLayers, NodeLayer outputLayer){
        this.inputLayer = inputLayer;
        this.hiddenLayers = hiddenLayers;
        this.outputLayer = outputLayer;
    }

    public void feedForward(List<Double> inputData){
        inputLayer.feedForward(inputData);
        for (NodeLayer nl: hiddenLayers){
            nl.feedForward();
        }
        outputLayer.feedForward();
    }

    public void backpropagate(List<Double> expect) {
        for (int i = 0; i < outputLayer.getLayer().size(); i++) {
            Node n = outputLayer.getLayer().get(i);
            double expected = expect.get(i);
            for (Connection c: n.getInputConnection()) {
                firstLayerPropagation(n, expected, c);
                //System.out.println("error: "+c.getError());
            }
        }
        for(NodeLayer nl: hiddenLayers) {
            for (Node n: nl.getLayer()) {
                for (Connection c: n.getInputConnection()) {
                    hiddenLayerPropagation(n, c);
                }
            }
        }


        for (int i = 0; i < outputLayer.getLayer().size(); i++) {
            Node n = outputLayer.getLayer().get(i);
            for (Connection c: n.getInputConnection()){
                c.resolveError(LEARNING_RATE);
            }
        }
        for(NodeLayer nl: hiddenLayers) {
            for (Node n: nl.getLayer()) {
                for (Connection c: n.getInputConnection()) {
                    c.resolveError(LEARNING_RATE);
                }
            }
        }
    }

    public void firstLayerPropagation(Node node, double expected, Connection input){
        double de_da = -2*(expected - node.getA());
        double da_dz = node.getDerivative();
        double dz_dw = input.getUnweightedInput();
        input.setError(de_da * da_dz /* dz_dw*/);
    }

    public void hiddenLayerPropagation(Node node, Connection input){
        double de_da = 0d;
        for (Connection c: node.getOutputConnection()){
            double temp = c.getError() * c.getWeight();
            de_da += temp;
        }
        double da_dz = node.getDerivative();
        double dz_dw = input.getUnweightedInput();
        input.setError(de_da * da_dz /* dz_dw*/);

    }

    public String getOutput(){
        String out = "";
        for (Node n: outputLayer.getLayer()) {
            out += n.getA();
        }
        return out;
    }




    @Override
    public String toString() {
        String out = "";
        out+="INPUT LAYER";
        for (Node in: inputLayer.getLayer()){
            out += "\n"+in.getID();
            for (Connection c: in.getOutputConnection()) {
                out += "\n\t"+in.getA()+" times " + c.getWeight() + " input to " + c.getOutputNode().getID();
            }
        }
        out+="\nHIDDEN LAYERS";
        for (NodeLayer nl: hiddenLayers) {
            for (Node in: nl.getLayer()){
                out += "\n" + in.getID() + "\t\tbias: " + in.getBias();
                for (Connection c: in.getOutputConnection()) {
                    out += "\n\t"+in.getA()+" times " + c.getWeight() + " to " + c.getOutputNode().getID();
                }
            }
        }
        out += "\nOUTPUT";
        for (Node in: outputLayer.getLayer()) {
            out += "\n"+in.getID() + "\t\tbias: " + in.getBias();
            out += "\n\t"+in.getA();

        }


        return out;
    }
}
