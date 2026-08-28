class Pokemon {
    int power;
    String type;

    Pokemon(int power, String type) {
        this.power = power;
        this.type = type;
    }

    Pokemon() {}

    void print() {
        System.out.println(power + " " + type);
    }
}

class Legendary extends Pokemon {
    int speed;
}

class GodPokemon extends Pokemon {
    String ability;
}

public class inheritance {
    public static void main(String[] args) {

        Pokemon p = new Pokemon(50, "water");
        p.print();

        Legendary l = new Legendary();
        l.speed = 40;
        l.power = 70;
        System.out.println(l.speed);
        l.print();

        GodPokemon g = new GodPokemon();
        g.ability = "fly";
        System.out.println(g.ability);
        g.power = 90;
        g.type = "unknown";
        g.print();
    }
}