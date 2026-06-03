# Instructions

| OPCODE | Instruction        | Body                    | Size | Desciption                   |
|--------|--------------------|-------------------------|------|------------------------------|
| 0x00   | nop                | OP                      | 1    | Does nothing for 1 cycle     |
| ...    
| 0x10   | write r2, r1       | OP,  4b[REG],  4b[REG]  | 2    | r2          = r1 
| 0x11   | write $AA, r1      | OP,  8b[REG],  8b ADDR  | 3    | MEM[0xAA]   = r1 
| 0x12   | write $AAAA, r1    | OP,  8b[REG], 16b ADDR  | 4    | MEM[0xAAAA] = r1 
| 0x13   | write r1, $AA      | OP,  8b ADDR,  8b[REG]  | 3    | r1          = MEM[0xAA]
| 0x14   | write r1, $AAAA    | OP, 16b ADDR,  8b[REG]  | 4    | r1          = MEM[0xAAAA]
| 0x15   | write $BB, $AA     | OP,  8b ADDR,  8b ADDR  | 3    | MEM[0xBB]   = MEM[0xAA]
| 0x16   | write $BBBB, $AA   | OP,  8b ADDR, 16b ADDR  | 4    | MEM[0xBBBB] = MEM[0xAA]
| 0x17   | write $BB, $AAAA   | OP, 16b ADDR,  8b ADDR  | 4    | MEM[0xBB]   = MEM[0xAAAA]
| 0x18   | write $BBBB, $AAAA | OP, 16b ADDR, 16b ADDR  | 5    | MEM[0xBBBB] = MEM[0xAAAA]
| 0x19   | write r1, 8b NUM   | OP,  8b[REG],  8b CONS  | 3    | r1          = 8b CONS 
| 0x1A   | write r1, 16b NUM  | OP,  8b[REG], 16b CONS  | 4    | r1          = 16b CONS
| ...
| 0x20   | adc r1, r2         | OP,  4b[REG],  4b[REG]  | 2    | r1          += r2 + C       | May set Carry
| 0x21   | adc r1, 16b NUM    | OP,  8b[REG], 16b CONS  | 4    | r1          += 16b CONS + C | May set Carry
| 0x22   | adc $AAAA, 16b NUM | OP, 16b ADDR, 16b CONS  | 5    | MEM[0xAAAA] += 16b CONS + C | May set Carry 
| 0x23   | sub r1, r2         | OP,  4b[REG],  4b[REG]  | 2    | r1          -= r2           | May set Underflow
| 0x24   | sub r1, 16b NUM    | OP,  8b[REG], 16b CONS  | 4    | r1          -= 16b CONS
| 0x25   | sub $AAAA, 16b NUM | OP, 16b ADDR, 16b CONS  | 5    | MEM[0xAAAA] -= 16b CONS
| 0x26   | mlt r1, r2         | OP,  4b[REG],  4b[REG]  | 2    | r1          *= r2           | May set Overflow
| 0x27   | mlt r1, 8b NUM     | OP,  8b[REG], 16b CONS  | 4    | r1          *= 16b CONS     | May set Overflow
| 0x28   | mlt $AAAA, 8b NUM  | OP, 16b ADDR, 16b CONS  | 5    | MEM[0xAAAA] *= 16b CONS     | May set Overflow
| 0x29   | div r1, r2         | OP,  4b[REG],  4b[REG]  | 2    | r1          /= r2            
| 0x2A   | div r1, 8b NUM     | OP,  8b[REG], 16b CONS  | 4    | r1          /= 16b CONS
| 0x2B   | div $AAAA, 8b NUM  | OP, 16b ADDR, 16b CONS  | 5    | MEM[0xAAAA] /= 16b CONS
| 0x2C   | inc r1             | OP,  8b[REG]            | 2    | r1          += 1            | May set Overflow
| 0x2D   | inc $AAAA          | OP, 16b ADDR            | 3    | MEM[0xAAAA] += 1            | May set Overflow
| 0x2E   | dec r1,            | OP,  8b[REG]            | 2    | r1          -= 1            | May set Underflow
| 0x2F   | dec $AAAA          | OP, 16b ADDR            | 3    | MEM[0xAAAA] -= 1            | May set Underflow
| 0x30   | and r1, r2          | OP,  4b[REG]  4b[REG]   | 2    | r1          &= r2
| 0x30   | and r1, 16b NUM     | OP,  8b[REG] 16b CONS   | 4    | r1          &= 16b CONS
| 0x30   | or r1, r2           | OP,  4b[REG]  4b[REG]   | 2    | r1          |= r2
| 0x30   | or r1, 16b NUM      | OP,  8b[REG] 16b CONS   | 4    | r1          |= 16b CONS
| 0x32   | ssl r1, 8b NUM      | OP,  8b[REG]  8b CONS   | 3    | r1         <<= 8b CONS 
| 0x33   | srl r1, 8b NUM      | OP,  8b[REG]  8b CONS   | 3    | r1         >>= 8b CONS  
| 0x34   | rol r1, 8b NUM      | OP,  8b[REG]  8b CONS   | 3    | rotate left r1 by 8b CONS
| 0x35   | ror r1, 8b NUM      | OP,  8b[REG]  8b CONS   | 3    | rotate right r1 by 8b CONS           
| ...
| 0x40   | cmp
| 0x41   |
| ...
| 0x90   | jmp $AAAA          | OP, 16b ADDR            | 3    | pc = 16b ADDR               
| 0x91   | jr  r1             | OP,  8b[REG]            | 2    | pc =  8b[REG]        
| 0x92   | jal $AAAA          | OP, 16b ADDR            | 3    | pc = 16b ADDR, ra = pc             
| 0x93   | beq $AAAA          | OP, 16b ADDR            | 3    | pc = 16b ADDR if ZERO == 1             
| 0x94   | bne $AAAA          | OP, 16b ADDR            | 3    | pc = 16b ADDR if ZERO == 0            
| 0x95   | bge $AAAA          | OP, 16b ADDR            | 3    | pc = 16b ADDR if CARRY == 0           
| 0x96   | blt $AAAA          | OP, 16b ADDR            | 3    | pc = 16b ADDR if CARRY == 1             
| ...
| 0xA0   | clc                | OP                      | 1    | CARRY = 0
| 0xA1   | cln                | OP                      | 1    | NEGATIVE = 0
| 0xA2   | clo                | OP                      | 1    | OVERFLOW = 0
| 0xA3   | sec                | OP                      | 1    | CARRY = 1
| 0xA4   | sen                | OP                      | 1    | NEGATIVE = 1
| 0xA5   | seo                | OP                      | 1    | OVERFLOW = 1
| ...
| 0xF0   | push               | OP                      | 1    | MEM[sp] = A, sp += 2
| 0xF2   | push 16b, NUM       | OP, 16b CONS            | 3    | MEM[sp] = 16b NUM, sp += 2
| 0xF3   | pop                | OP                      | 1    | A       = MEM[sp], sp -= 2




