import java.util.ArrayList;
import java.util.List;

public class NodeLayer {
    private List<Node> layer;
    
    public NodeLayer(int num, boolean input) {
        //create list of nodes
        layer = new ArrayList<>();
        if (input) {
            for (int i = 0; i < num; i++){
                layer.add(new InputNode());
            }
        } else {
            for (int i = 0; i < num; i++){
                layer.add(new Node());
            }
        }
    }
    public NodeLayer(int num, boolean input, NodeLayer nodeLayer) {
        //create list of nodes and connect to other layer as output
        this(num, input);
        for (Node to: layer) {
            for(Node from: nodeLayer.getLayer()) {
                Connection c = new Connection(from, to);
                from.addOutputConnection(c);
                to.addInputConnection(c);
            }
        }
    }

    public void feedForward() {
        for (Node n: layer) {
            n.feedForward();
        }

    }

    public void feedForward(List<Double> data) {
        for (int i = 0; i < layer.size(); i++) {
            InputNode in = (InputNode) layer.get(i);
            double d = 1d;
            try {
                d = data.get(i);
            } catch (IndexOutOfBoundsException ignored) {

            }
            in.start(d);
        }
        feedForward();
    }
    public List<Node> getLayer() {
        return layer;
    }

    public void setLayer(List<Node> layer) {
        this.layer = layer;
    }

    public double size() {
        return layer.size();
    }
}
