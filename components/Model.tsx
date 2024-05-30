"use client";

import { addUserEmailToProduct, deleteProduct } from "@/lib/actions";
import {
  Dialog,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import Image from "next/image";
import { FormEvent, Fragment, useState } from "react";
import { useRouter } from 'next/navigation'

interface Props {
  productId : string
}

const Modal = ({ productId } : Props) => {
  const [isOpen, setIsOpen] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [email, setEmail] = useState('');
  const router = useRouter()

  const handleSubmit = async(e : FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    await addUserEmailToProduct(productId,email);

    setIsSubmitting(false);
    setEmail('');
    setIsOpen(false);
  }

  const openModal = () => {
    setIsOpen(true);
  }

  const closeModal = () => {
    setIsOpen(false)
  }

  const handleDelete = async() => {
    setIsDeleting(true);
    await deleteProduct(productId);
    setIsDeleting(false);

    alert('Product Deleted!');
    // router.push('/');
    router.refresh();
  }

  return (
    <>
      <div className="flex justify-between">
      <button onClick={openModal} type="button" className="btn w-96 self-center">
        Track
      </button>
      <button disabled={isDeleting} onClick={handleDelete} type="button" className="btn w-96 self-center">
        Delete
      </button>
      </div>

    <Transition appear as={Fragment} show={isOpen} >
    <Dialog
        as="div"
        open={isOpen}
        onClose={closeModal}
        className="dialog-container"
      >
        <div className="min-h-screen px-4 text-center">
        {/* <TransitionChild as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0" >
         
        </TransitionChild> */}

        <span className="inline-block h-screen align-middle" aria-hidden="true" />

        <TransitionChild as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95" >
          <div className="dialog-content"> 
            <div className="flex flex-col">
              <div className="flex justify-between">
                  <div className="p-3 border border-gray-200 rounded-10">
                    <Image src="/assets/icons/logo.svg" alt="logo" width={28} height={28} />
                  </div>

                  <Image src={"/assets/icons/x-close.svg"} alt="close" width={24} height={24} className="cursor-pointer" onClick={closeModal} />
              </div>

              <h4 className="dialog-head_text">
                Stay updated with product pricing alerts right in your inbox.
              </h4>

              <p className="text-sm p-2 text-gray-600">
                Never miss a bargain again with our timely alerts.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col mt-5">
              <label htmlFor="email" className="text-sm font-medium text-gray-700">Email Address</label>
              <div className="dialog-input_container">
                <Image src={"/assets/icons/mail.svg"} alt="email" width={18} height={18} />
                <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required id="email" placeholder="Email Address" className="dialog-input" />
              </div>

              <button type="submit" className="dialog-btn">
                {
                  isSubmitting ? 'Submitting...' : 'Submit'
                }
              </button>
            </form>
          </div>
        </TransitionChild>
        </div>
      </Dialog>
    </Transition>
    </>
  );
};

export default Modal;
