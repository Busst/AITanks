

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.net.Socket;
import java.net.UnknownHostException;

import java.util.Random;

public class NodeJsEcho {
    //socket object
    private Socket socket = null;
    private PrintWriter out;
    private  BufferedReader in;

    public static void main(String[] args) throws UnknownHostException, IOException, ClassNotFoundException {
        NodeJsEcho client = new NodeJsEcho();

        String ip = "127.0.0.1";
        int port = 5001;
        //Random rr = new Random(1);
        client.startConnection(ip, port);
        int rr = 0;
        int count = 0;
        client.out.write("11000");
        client.stopConnection();


    }

    private String getMovement(int gen) {
        String move = "";
        if (gen < 40) {
            move = "11000";
        } else if (gen < 50) {
            move = "00100";
        } else if (gen < 75) {
            move = "01000";
        } else if (gen < 100){
            move = "00010";
        }


        return move;

    }

    private void startConnection(String ip, int port) throws IOException {
        socket = new Socket(ip, port);
        out = new PrintWriter(socket.getOutputStream(), true);
        in = new BufferedReader(new InputStreamReader(socket.getInputStream()));
    }

    private void stopConnection() throws IOException {
        in.close();
        out.close();
        socket.close();
    }

    public static class Test {
        private int num;
        Test (int num) {
            this.num = num;
        }
    }

}
