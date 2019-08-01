

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.net.Socket;
import java.net.UnknownHostException;

import java.net.DatagramPacket;
import java.net.DatagramSocket;
import java.net.InetAddress;
import java.util.Scanner;

import java.util.Random;

public class NodeJsEcho {
    //socket object
    private Socket socket = null;
    private PrintWriter out;
    private  BufferedReader in;

    public static void main(String[] args) throws UnknownHostException, IOException, ClassNotFoundException {
        NodeJsEcho client = new NodeJsEcho();

        DatagramSocket ds = new DatagramSocket(5002);
        InetAddress localhost = InetAddress.getLocalHost();
        ds.connect(localhost, 5001);
        String h = "Hello World! x2";
        byte[] bb = h.getBytes();

        DatagramPacket dd = new DatagramPacket(bb, bb.length, localhost, 5001);
        ds.send(dd);
        byte[] tt = new byte[1024];
        DatagramPacket rd = new DatagramPacket(tt, tt.length);
        ds.receive(rd);
        System.out.println(messageToString(rd.getData()));
        ds.close();



        //int port = 5001;
        //Random rr = new Random(1);


    }

    private static  String messageToString(byte[] tt) {
        String out = "";
        for (int i = 0; i < tt.length; i++) {
            out += (char)(tt[i]);
        }
        return out;
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
