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

    public boolean receiveMap() throws IOException {
        int byteSize = UDPsocket.getReceiveBufferSize();
        byte[] bb = new byte[byteSize];
        DatagramPacket packet = new DatagramPacket(bb, byteSize);
        UDPsocket.receive(packet);
        System.out.println(new String(packet.getData(), 0, packet.getLength()));
        return true;
    }

    public void close() {
        UDPsocket.close();
    }

    public static void main(String[] args) throws IOException {
        Client client = new Client("localhost", 5002);
        while (client.receiveMap()) {

        }
    }
}
