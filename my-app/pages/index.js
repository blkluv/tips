import axios from "axios";
import { BiPlus } from "react-icons/bi";
import { Contract, providers } from "ethers";
import { formatEther } from "ethers/lib/utils";
import { useEffect, useRef, useState } from "react";
import Web3Modal from "web3modal";
import Layout from "../components/Layout";
import { CONTRACT_ADDRESS, abi } from "../constants";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [walletConnected, setWalletConnected] = useState(false);
  const web3ModalRef = useRef();
  const fileRef = useRef();

  const [data, setData] = useState("");

  const [file, setFile] = useState("");

  const [description, setDescription] = useState("");

  //////////////////////////////
  const getProviderOrSigner = async (needSigner = false) => {
    const provider = await web3ModalRef.current.connect();
    const web3Provider = new providers.Web3Provider(provider);

    const { chainId } = await web3Provider.getNetwork();
    if (chainId !== 80001) {
      window.alert("Change the network to Mumbai");
      throw new Error("Change network to Mumbai");
    }

    if (needSigner) {
      const signer = web3Provider.getSigner();
      return signer;
    }
    return web3Provider;
  };

  const getDaoContractInstance = (providerOrSigner) => {
    return new Contract(CONTRACT_ADDRESS, abi, providerOrSigner);
  };

  const connectWallet = async () => {
    try {
      await getProviderOrSigner();
      setWalletConnected(true);
    } catch (error) {
      console.error(error);
    }
  };

  const addPost = async () => {
    try {
      const signer = await getProviderOrSigner(true);
      const contract = getDaoContractInstance(signer);

      const imgCID = await saveToIPFS(file);

      const txn = await contract.addPost(description, imgCID);
      setLoading(true);
      setDescription("");
      setFile("");
      await txn.wait();
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const getPost = async (id) => {
    try {
      const provider = await getProviderOrSigner(false);
      const contract = getDaoContractInstance(provider);

      const txn = await contract.getPost(0);
      setLoading(true);

      console.log(txn);

      setData(txn);
      setLoading(false);

      return txn;
    } catch (error) {
      console.log(error);
    }
  };

  const saveToIPFS = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    const TOKEN = process.env.NEXT_PUBLIC_WEB3_STORAGE_TOKEN;
    var config = {
      method: "post",
      url: "https://api.web3.storage/upload",
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        "Content-Type": "text/plain",
      },
      data: formData,
    };

    const response = await axios(config);
    return response.data.cid;
  };

  useEffect(() => {
    if (!walletConnected) {
      web3ModalRef.current = new Web3Modal({
        network: "mumbai",
        providerOptions: {},
        disableInjectedProvider: false,
      });

      connectWallet();
    }
  }, [walletConnected]);

  return (
    <>
      {!walletConnected ? (
        <section className="relative bg-black flex flex-col h-screen justify-center items-center">
          <p
            className="text-xl text-gray-400 mb-8 p-5"
            data-aos="zoom-y-out"
            data-aos-delay="150"
          >
            <span className="bg-clip-text text-3xl  text-transparent bg-gradient-to-r from-pink-500 to-purple-400">
              Decentralized Social Media{" "}
            </span>
            Built on top of the Polygon blockchain, luv is the new like. Unlock the magic with a tap of 💝 to send a tip!
          </p>
          <button
            onClick={connectWallet}
            className="items-center bg-gradient-to-r from-pink-500 to-purple-400 rounded-full font-medium p-4 shadow-lg"
          >
            Connect Wallet
          </button>
        </section>
      ) : (
        <Layout title="Home">
          <div className="flex flex-col items-center bg-gray-800-900 p-4">
            <div className="flex-col items-center">
              <textarea
                value={description}
                placeholder="Positive vibes only..."
                className="w-80 h-32 placeholder:text-gray-600 bg-black rounded-md mt-2 p-2 border border-[#444752] focus:outline-none"
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div>
              <label className="text-[#9CA3AF] mt-10">Upload Good Juju</label>
              <div
                className="border-2 w-64 border-gray-600  border-dashed rounded-md mt-2 p-2  h-36 items-center justify-center flex"
                onClick={() => {
                  fileRef.current.click();
                }}
              >
                {file ? (
                  <img
                    onClick={() => {
                      fileRef.current.click();
                    }}
                    src={URL.createObjectURL(file)}
                    alt="file"
                    className="h-full rounded-md"
                  />
                ) : (
                  <BiPlus size={40} color="gray" />
                )}
              </div>
              <input
                type="file"
                className="hidden"
                ref={fileRef}
                onChange={(e) => {
                  setFile(e.target.files[0]);
                }}
              />
            </div>
            <div>
              <button
                className="items-center bg-gradient-to-r from-pink-500 to-purple-400 rounded-full font-medium p-2 shadow-lg m-4 w-24"
                onClick={addPost}
              >
                <span role="img" aria-label="Sparkles">
                  ✨
                </span>
              </button>
            </div>
          </div>
        </Layout>
      )}
    </>
  );
}
