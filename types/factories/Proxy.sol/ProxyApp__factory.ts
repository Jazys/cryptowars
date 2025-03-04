/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../common";
import type { ProxyApp, ProxyAppInterface } from "../../Proxy.sol/ProxyApp";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_implementation",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    stateMutability: "payable",
    type: "fallback",
  },
  {
    inputs: [],
    name: "admin",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "implementation",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newImplementation",
        type: "address",
      },
    ],
    name: "upgrade",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

const _bytecode =
  "0x608060405234801561001057600080fd5b5060405161030e38038061030e83398101604081905261002f9161005d565b600080546001600160a01b039092166001600160a01b0319928316179055600180549091163317905561008b565b60006020828403121561006e578081fd5b81516001600160a01b0381168114610084578182fd5b9392505050565b6102748061009a6000396000f3fe6080604052600436106100345760003560e01c80630900f010146100c35780635c60da1b146100e5578063f851a44014610110575b6000805460405182916001600160a01b03169061005490839036906101bd565b600060405180830381855af49150503d806000811461008f576040519150601f19603f3d011682016040523d82523d6000602084013e610094565b606091505b5091509150816100bf5760405162461bcd60e51b81526004016100b690610211565b60405180910390fd5b5050005b3480156100cf57600080fd5b506100e36100de36600461018f565b610125565b005b3480156100f157600080fd5b506100fa610171565b60405161010791906101cd565b60405180910390f35b34801561011c57600080fd5b506100fa610180565b6001546001600160a01b0316331461014f5760405162461bcd60e51b81526004016100b6906101e1565b600080546001600160a01b0319166001600160a01b0392909216919091179055565b6000546001600160a01b031681565b6001546001600160a01b031681565b6000602082840312156101a0578081fd5b81356001600160a01b03811681146101b6578182fd5b9392505050565b6000828483379101908152919050565b6001600160a01b0391909116815260200190565b6020808252601690820152754f6e6c792061646d696e2063616e207570677261646560501b604082015260600190565b60208082526013908201527211195b1959d85d1958d85b1b0819985a5b1959606a1b60408201526060019056fea2646970667358221220c948671407748a1ecde362c31329c35ba200f1ca5ed580baa9d034dd016accf164736f6c63430008000033";

type ProxyAppConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: ProxyAppConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class ProxyApp__factory extends ContractFactory {
  constructor(...args: ProxyAppConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    _implementation: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ProxyApp> {
    return super.deploy(_implementation, overrides || {}) as Promise<ProxyApp>;
  }
  override getDeployTransaction(
    _implementation: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(_implementation, overrides || {});
  }
  override attach(address: string): ProxyApp {
    return super.attach(address) as ProxyApp;
  }
  override connect(signer: Signer): ProxyApp__factory {
    return super.connect(signer) as ProxyApp__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): ProxyAppInterface {
    return new utils.Interface(_abi) as ProxyAppInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): ProxyApp {
    return new Contract(address, _abi, signerOrProvider) as ProxyApp;
  }
}
