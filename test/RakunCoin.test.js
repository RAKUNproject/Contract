const shouldFail = require('./helpers/shouldFail');
const { decodeLogs } = require('./helpers/decodeLogs');
const { ZERO_ADDRESS } = require('./helpers/constants');
const RakunCoin = artifacts.require('RakunCoin');

const BigNumber = web3.BigNumber;

require('chai')
  .use(require('chai-bignumber')(BigNumber))
  .should();

contract('RakunCoin', function ([_, owner, user, user2]) {
  const TOTAL_SUPPLY = 500000000;
  const DESIMALS = 18;
  const TOTAL_SUPPLY_BN = new BigNumber(TOTAL_SUPPLY).times(`1e${DESIMALS}`);
  const amount = 100;

  beforeEach(async function () {
    this.token = await RakunCoin.new({ from: owner });
  });

  it('has a name', async function () {
    (await this.token.name()).should.equal('RAKUN');
  });

  it('has a symbol', async function () {
    (await this.token.symbol()).should.equal('RAKU');
  });

  it('has 18 decimals', async function () {
    (await this.token.decimals()).should.be.bignumber.equal(DESIMALS);
  });

  it('has totalSupply', async function () {
    (await this.token.totalSupply()).should.be.bignumber.equal(TOTAL_SUPPLY_BN);
  });

  it('assigns the initial total supply to the owner', async function () {
    const totalSupply = await this.token.totalSupply();
    const ownerBalance = await this.token.balanceOf(owner);

    ownerBalance.should.be.bignumber.equal(totalSupply);

    const receipt = await web3.eth.getTransactionReceipt(this.token.transactionHash);
    const logs = decodeLogs(receipt.logs, RakunCoin, this.token.address);
    logs.length.should.equal(4);
    logs[0].event.should.equal('PauserAdded');
    logs[0].args.account.valueOf().should.equal(owner);
    logs[1].event.should.equal('MinterAdded');
    logs[1].args.account.valueOf().should.equal(owner);
    logs[2].event.should.equal('OwnershipTransferred');
    logs[2].args.newOwner.valueOf().should.equal(owner);
    logs[3].event.should.equal('Transfer');
    logs[3].args.from.valueOf().should.equal(ZERO_ADDRESS);
    logs[3].args.to.valueOf().should.equal(owner);
    logs[3].args.value.should.be.bignumber.equal(totalSupply);
  });

  describe('balanceOf', function () {
    it('returns zero', async function () {
      (await this.token.balanceOf(user)).should.be.bignumber.equal(0);
    });

    it('returns the total amount of tokens', async function () {
      (await this.token.balanceOf(owner)).should.be.bignumber.equal(TOTAL_SUPPLY_BN);
    });
  });

  describe('transfer', function () {
    it('owner', async function () {
      await this.token.transfer(user, amount, { from: owner });
      (await this.token.balanceOf(owner)).should.be.bignumber.equal(TOTAL_SUPPLY_BN.minus(amount));
    });

    it('user', async function () {
      await this.token.transfer(user, amount, { from: owner });
      (await this.token.balanceOf(user)).should.be.bignumber.equal(amount);
    });
  });

  it('approve', async function () {
    await this.token.approve(user, amount, { from: owner });
  });

  it('allowance', async function () {
    await this.token.approve(user, amount, { from: owner });
    (await this.token.allowance(owner, user)).should.be.bignumber.equal(amount);
  });

  it('transferFrom', async function () {
    await this.token.approve(user, amount, { from: owner });
    await this.token.transferFrom(owner, user, amount, { from: user });
    (await this.token.balanceOf(owner)).should.be.bignumber.equal(TOTAL_SUPPLY_BN.minus(amount));
    (await this.token.balanceOf(user)).should.be.bignumber.equal(amount);
  });

  it('decreaseAllowance', async function () {
    await this.token.approve(user, amount, { from: owner });
    await this.token.decreaseAllowance(user, amount - 30, { from: owner });
    (await this.token.allowance(owner, user)).should.be.bignumber.equal(30);
  });

  it('increaseAllowance', async function () {
    await this.token.approve(user, amount, { from: owner });
    await this.token.increaseAllowance(user, amount, { from: owner });
    (await this.token.allowance(owner, user)).should.be.bignumber.equal(amount * 2);
  });

  describe('Pause', function () {
    it('paused', async function () {
      (await this.token.paused()).should.equal(false);
    });

    it('pauses the token', async function () {
      await this.token.pause({ from: owner });
      (await this.token.paused()).should.equal(true);
      await shouldFail.reverting(this.token.transfer(user, 100, { from: owner }));
    });

    it('unpauses the token', async function () {
      await this.token.pause({ from: owner });
      await this.token.unpause({ from: owner });
      (await this.token.paused()).should.equal(false);
      await this.token.transfer(user, 100, { from: owner });
    });

    describe('Pauser Role', function () {
      beforeEach(async function () {
        await this.token.addPauser(user, { from: owner });
      });

      it('addPauser', async function () {
        await this.token.pause({ from: user });
      });

      it('isPauser', async function () {
        (await this.token.isPauser(user)).should.equal(true);
      });

      it('removePauser', async function () {
        await this.token.removePauser(user, { from: owner });
        await shouldFail.reverting(this.token.pause({ from: user }));
      });

      it('reverts when remove Pauser role by myself', async function () {
        await shouldFail.reverting(this.token.removePauser(user, { from: user }));
      });

      it('reverts when remove Pauser role by not owner', async function () {
        await shouldFail.reverting(this.token.removePauser(user, { from: user2 }));
      });

      it('renouncePauser', async function () {
        await this.token.renouncePauser({ from: owner });
        (await this.token.isPauser(owner)).should.equal(false);
      });
    });
  });

  describe('Mint', function () {
    it('mintable the token', async function () {
      await this.token.mint(user, amount, { from: owner });
      (await this.token.balanceOf(user)).should.be.bignumber.equal(amount);
      (await this.token.totalSupply()).should.be.bignumber.equal(TOTAL_SUPPLY_BN.plus(amount));
    });

    describe('Minter Role', function () {
      beforeEach(async function () {
        await this.token.addMinter(user, { from: owner });
      });

      it('addMinter', async function () {
        await this.token.mint(user, amount, { from: user });
      });

      it('isMinter', async function () {
        (await this.token.isMinter(user)).should.equal(true);
      });

      it('removeMinter', async function () {
        await this.token.removeMinter(user, { from: owner });
        await shouldFail.reverting(this.token.mint(user, amount, { from: user }));
      });

      it('reverts when remove Minter role by myself', async function () {
        await shouldFail.reverting(this.token.removeMinter(user, { from: user }));
      });

      it('reverts when remove Minter role by not owner', async function () {
        await shouldFail.reverting(this.token.removeMinter(user, { from: user2 }));
      });

      it('renounceMinter', async function () {
        await this.token.renounceMinter({ from: owner });
        (await this.token.isMinter(owner)).should.equal(false);
      });
    });
  });

  describe('Ownable', function () {
    it('owner', async function () {
      (await this.token.owner()).should.equal(owner);
    });

    it('isOwner', async function () {
      (await this.token.isOwner({ from: owner })).should.equal(true);
    });

    it('transferOwnership', async function () {
      await this.token.transferOwnership(user, { from: owner });
      (await this.token.isOwner({ from: owner })).should.equal(false);
      (await this.token.isOwner({ from: user })).should.equal(true);
    });

    it('renounceOwnership', async function () {
      await this.token.renounceOwnership({ from: owner });
      (await this.token.isOwner({ from: owner })).should.equal(false);
    });
  });
});
