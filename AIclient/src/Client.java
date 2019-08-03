import javax.xml.crypto.Data;
import java.io.*;
import java.net.*;

public class Client {
    private DatagramSocket UDPsocket;
    private InetAddress address;

    public Client(String address, int port) throws UnknownHostException, SocketException {
        this.address = InetAddress.getByName(address);
        UDPsocket = new DatagramSocket(6000);
    }
    public String sendEcho(String msg) throws IOException {
        byte[] bb = msg.getBytes();
        DatagramPacket packet = new DatagramPacket(bb, bb.length, address, 5002);
        UDPsocket.send(packet);
        packet = new DatagramPacket(bb, bb.length);
        UDPsocket.receive(packet);
        String res = new String(packet.getData(), 0, packet.getLength());
        return res;
    }

    public boolean receiveMap(int byteSize) throws IOException {
        byte[] bb = new byte[byteSize];

        return true;
    }

    public void close() {
        UDPsocket.close();
    }
    public int bufferSize() throws SocketException {
        return UDPsocket.getReceiveBufferSize();
    }

    public DatagramPacket receivePacket(byte[] bb, int byteSize) throws IOException {
        DatagramPacket packet = new DatagramPacket(bb, byteSize);
        UDPsocket.receive(packet);
        return packet;
    }

    public static void main(String[] args) throws IOException {
        Client client = new Client("localhost", 5002);
        int bufferSize = client.bufferSize();
        while (bufferSize > 0) {
            byte[] bb = new byte[bufferSize];
            DatagramPacket dp = client.receivePacket(bb, bufferSize);
            String data = printDatagramPacket(dp);
            System.out.println(data);
            bufferSize = client.bufferSize();

        }
    }
    static String printDatagramPacket(DatagramPacket dp) {
        return new String(dp.getData(), 0, dp.getLength());
    }
}
